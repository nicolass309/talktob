import { Buffer } from 'node:buffer';

const API_URL = process.env.VITE_API_URL || 'http://localhost:8000';
const DEV_TOKEN = process.env.VITE_DEV_AUTH_TOKEN || 'dev:mi_usuario_local';

console.log(`=== STARTING SMOKE E2E INTEGRATION TEST ===`);
console.log(`Target API URL: ${API_URL}`);
console.log(`Dev Auth Token: ${DEV_TOKEN}\n`);

async function apiCall(endpoint, method = 'GET', body = null) {
  const url = endpoint.startsWith('http') ? endpoint : `${API_URL}${endpoint}`;
  const headers = {
    'Authorization': `Bearer ${DEV_TOKEN}`,
  };
  if (body && !(body instanceof Blob) && !(body instanceof Buffer)) {
    headers['Content-Type'] = 'application/json';
  }

  const options = {
    method,
    headers,
  };

  if (body) {
    if (typeof body === 'object' && !(body instanceof Blob) && !(body instanceof Buffer)) {
      options.body = JSON.stringify(body);
    } else {
      options.body = body;
    }
  }

  const res = await fetch(url, options);
  console.log(`HTTP ${method} ${endpoint} -> ${res.status} ${res.statusText}`);

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`API Error ${res.status}: ${errorText}`);
  }

  if (res.status === 204) return {};
  return await res.json();
}

async function runSmokeTest() {
  try {
    // 1. Check backend health
    console.log('1. Checking backend health...');
    const health = await apiCall('/health');
    console.log('   Health response:', JSON.stringify(health));

    // 2. Fetch or create word
    console.log('\n2. Fetching words list (GET /api/v1/words)...');
    let wordsRes = await apiCall('/api/v1/words?limit=10');
    let targetWord = wordsRes.items && wordsRes.items.length > 0 ? wordsRes.items[0] : null;

    if (!targetWord) {
      console.log('   No words found. Creating a test word (POST /api/v1/words)...');
      targetWord = await apiCall('/api/v1/words', 'POST', {
        word: `TEST_WORD_${Date.now()}`,
        category: 'Comunidad LSCH',
        description: 'Palabra de prueba e2e',
        urgency: 'alta',
      });
    }
    console.log(`   Selected word: ${targetWord.word} (ID: ${targetWord.id})`);

    // 3. Get initial profile (/me)
    console.log('\n3. Fetching initial user profile (GET /api/v1/me)...');
    const initialProfile = await apiCall('/api/v1/me');
    console.log(`   Initial points: ${initialProfile.points}`);

    // 4. Create Contribution
    const clientId = `smoke_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    console.log(`\n4. Creating contribution (POST /api/v1/contributions, clientId: ${clientId})...`);
    const contrib = await apiCall('/api/v1/contributions', 'POST', {
      clientId,
      wordId: targetWord.id,
    });
    console.log(`   Contribution created: ID ${contrib.id}, Status: ${contrib.status}`);

    // 5. Upload 3 takes
    console.log('\n5. Processing 3 takes (Request presigned -> PUT blob -> Complete take)...');
    for (let i = 1; i <= 3; i++) {
      console.log(`\n   --- TAKE ${i} ---`);
      const fakeVideoBuffer = Buffer.from(`FAKE_VIDEO_CONTENT_TAKE_${i}_${Date.now()}_PAD_TO_SOME_LENGTH_1234567890`);
      const takePayload = {
        takeNumber: i,
        mimeType: 'video/webm',
        sizeBytes: fakeVideoBuffer.byteLength,
        durationMs: 3500,
        recordedAt: new Date().toISOString(),
      };

      // 5a. Presigned upload request
      const presigned = await apiCall(`/api/v1/contributions/${contrib.id}/takes`, 'POST', takePayload);
      console.log(`   Presigned URL received for take ${i}: ${presigned.upload.url}`);

      // 5b. PUT payload to presigned URL
      const putRes = await fetch(presigned.upload.url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'video/webm',
        },
        body: fakeVideoBuffer,
      });
      console.log(`   HTTP PUT take ${i} blob -> ${putRes.status} ${putRes.statusText}`);
      if (!putRes.ok) {
        throw new Error(`PUT upload failed for take ${i}: HTTP ${putRes.status}`);
      }

      // 5c. Complete take
      const completeRes = await apiCall(`/api/v1/contributions/${contrib.id}/takes/${i}/complete`, 'POST');
      console.log(`   Take ${i} completed. StorageKey: ${completeRes.take.storageKey}`);
    }

    // 6. Submit Contribution
    console.log('\n6. Submitting contribution (POST /api/v1/contributions/${id}/submit)...');
    const submitted = await apiCall(`/api/v1/contributions/${contrib.id}/submit`, 'POST');
    console.log(`   Contribution submitted successfully!`);
    console.log(`   Status: ${submitted.status}, ReviewStatus: ${submitted.reviewStatus}, PointsEarned: ${submitted.pointsEarned}`);

    // 7. Verify user profile points
    console.log('\n7. Verifying updated user profile (GET /api/v1/me)...');
    const updatedProfile = await apiCall('/api/v1/me');
    console.log(`   Updated points: ${updatedProfile.points} (earned +${updatedProfile.points - initialProfile.points})`);
    if (updatedProfile.points < initialProfile.points) {
      throw new Error(`Profile points decreased! Initial: ${initialProfile.points}, Updated: ${updatedProfile.points}`);
    }

    // 8. Verify user contributions list
    console.log('\n8. Verifying user contributions list (GET /api/v1/contributions)...');
    const userContribs = await apiCall('/api/v1/contributions?limit=20');
    const found = userContribs.items?.find((c) => c.id === contrib.id || c.clientId === clientId);
    if (!found) {
      throw new Error(`Submitted contribution ID ${contrib.id} not found in user contributions list!`);
    }
    console.log(`   Contribution found in list! ID: ${found.id}, WordId: ${found.wordId}`);

    console.log('\n=== SMOKE E2E TEST PASSED SUCCESSFULLY ===');
    process.exit(0);
  } catch (err) {
    console.error('\n❌ SMOKE E2E TEST FAILED:');
    console.error(err);
    process.exit(1);
  }
}

runSmokeTest();
