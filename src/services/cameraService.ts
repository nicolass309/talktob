export interface CameraStreamResult {
  stream: MediaStream | null;
  error?: string;
  isSimulated?: boolean;
}

export class CameraService {
  private currentStream: MediaStream | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];
  private simulationInterval: number | null = null;

  async startCamera(facingMode: 'user' | 'environment' = 'user'): Promise<CameraStreamResult> {
    this.stopCamera();

    // Check if mediaDevices is supported
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const constraints: MediaStreamConstraints = {
          video: {
            facingMode: { ideal: facingMode },
            width: { ideal: 720 },
            height: { ideal: 1280 }
          },
          audio: false
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        this.currentStream = stream;
        return { stream, isSimulated: false };
      } catch (err: any) {
        console.warn('Real camera unavailable, initializing camera simulator:', err.message);
        return this.createSimulatedStream();
      }
    } else {
      return this.createSimulatedStream();
    }
  }

  // Creates a simulated live stream on canvas with visual head & hands moving in LSCH pattern
  private createSimulatedStream(): CameraStreamResult {
    const canvas = document.createElement('canvas');
    canvas.width = 480;
    canvas.height = 640;
    const ctx = canvas.getContext('2d');
    if (!ctx) return { stream: null, error: 'No se pudo crear el visor de cámara' };

    let frame = 0;
    const renderSimulation = () => {
      frame++;
      // Background gradient
      const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      grad.addColorStop(0, '#0f172a');
      grad.addColorStop(1, '#020617');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw subtle grid
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.12)';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // Draw avatar silhouette performing sign
      const centerX = canvas.width / 2;
      const headY = 170;
      const shoulderY = 270;

      // Head
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(centerX, headY, 55, 0, Math.PI * 2);
      ctx.fill();

      // Torso
      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.ellipse(centerX, shoulderY + 80, 110, 90, 0, 0, Math.PI * 2);
      ctx.fill();

      // Hands moving in LSCH sign gesture
      const handOffset1 = Math.sin(frame * 0.08) * 45;
      const handOffset2 = Math.cos(frame * 0.08) * 35;

      // Left Hand
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(centerX - 90 + handOffset1, shoulderY + 40 + handOffset2, 28, 0, Math.PI * 2);
      ctx.fill();

      // Right Hand
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(centerX + 90 - handOffset1, shoulderY + 40 - handOffset2, 28, 0, Math.PI * 2);
      ctx.fill();

      // Text Badge
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.font = 'bold 15px Plus Jakarta Sans, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('• Visor de Seña LSCH Activo •', centerX, canvas.height - 40);
    };

    const stream = canvas.captureStream(30);
    this.simulationInterval = window.setInterval(renderSimulation, 1000 / 30);
    this.currentStream = stream;

    return { stream, isSimulated: true };
  }

  startRecording(): boolean {
    if (!this.currentStream) return false;

    this.recordedChunks = [];
    let options: MediaRecorderOptions = {};

    if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
      options = { mimeType: 'video/webm;codecs=vp9' };
    } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8')) {
      options = { mimeType: 'video/webm;codecs=vp8' };
    } else if (MediaRecorder.isTypeSupported('video/mp4')) {
      options = { mimeType: 'video/mp4' };
    }

    try {
      this.mediaRecorder = new MediaRecorder(this.currentStream, options);
    } catch (e) {
      try {
        this.mediaRecorder = new MediaRecorder(this.currentStream);
      } catch (err) {
        console.error('Error creating MediaRecorder:', err);
        return false;
      }
    }

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        this.recordedChunks.push(event.data);
      }
    };

    this.mediaRecorder.start(100);
    return true;
  }

  async stopRecording(): Promise<{ blob: Blob; url: string }> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        return reject(new Error('MediaRecorder no inicializado'));
      }

      this.mediaRecorder.onstop = () => {
        const mimeType = this.mediaRecorder?.mimeType || 'video/webm';
        const blob = new Blob(this.recordedChunks, { type: mimeType });
        const url = URL.createObjectURL(blob);
        resolve({ blob, url });
      };

      if (this.mediaRecorder.state !== 'inactive') {
        this.mediaRecorder.stop();
      }
    });
  }

  stopCamera(): void {
    if (this.simulationInterval !== null) {
      clearInterval(this.simulationInterval);
      this.simulationInterval = null;
    }

    if (this.currentStream) {
      this.currentStream.getTracks().forEach((track) => track.stop());
      this.currentStream = null;
    }
  }
}

export const cameraService = new CameraService();
