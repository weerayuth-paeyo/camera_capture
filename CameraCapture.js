const cameraCapture = {
    video: null,
    canvas: null,
    image: null,
    openButton: null,
    closeButton: null,
    captureButton: null,
    stream: null,
    constraints: {
        video: {
            facingMode: 'environment',
            width: { ideal: 1920 },
            height: { ideal: 1080 },
            aspectRatio: { ideal: 16 / 9 }
        }
    },

    initialize: function (frameId) {
        const frame = document.getElementById(frameId);
        frame.innerHTML = `
            <video id="videoElement" autoplay style="width: 100%; max-height: 300px; display: none;"></video>
            <canvas id="canvas" style="width: 100%; height: 300px; display:none;"></canvas>
            <img src="#" alt="" id="preImgCapTure" style="max-width: 500px; display: none;">
            <div id="tapFooterButton" style="display: none; width: 500px;">
                <div style="display: flex; flex-direction: row; flex-wrap: wrap; align-content: center; justify-content: center; align-items: center; padding: 10px; gap: 10px; background-color: #b8b8b8;">
                    <button style="border-radius: 25px !important; padding: 5px 20px;" id="captureButton"><i class="fa fa-camera"></i>&nbsp;ถ่าย</button>
                    <button style="border-radius: 25px !important; padding: 5px 20px;" id="closeButton"><i class="fa fa-close"></i>&nbsp;ปิด</button>
                </div>
            </div>
            <button style="margin-top:20px; border-radius: 25px !important; padding: 5px 20px;" id="openButton"><i class="fa fa-camera"></i>&nbsp;เปิดกล้อง</button>
        `;

        this.video = frame.querySelector('#videoElement');
        this.canvas = frame.querySelector('#canvas');
        this.image = frame.querySelector('#preImgCapTure');
        this.openButton = frame.querySelector('#openButton');
        this.closeButton = frame.querySelector('#closeButton');
        this.captureButton = frame.querySelector('#captureButton');

        this.openButton.addEventListener('click', this.openCamera.bind(this));
        this.closeButton.addEventListener('click', this.closeCamera.bind(this));
        this.captureButton.addEventListener('click', this.captureImage.bind(this));

        this.closeButton.disabled = true;
        this.captureButton.disabled = true;
    },

    openCamera: function () {
        navigator.mediaDevices.getUserMedia(this.constraints)
            .then(videoStream => {
                this.video.style.display = 'block';
                this.video.style.transform = 'scaleX(-1)';
                this.stream = videoStream;
                this.video.srcObject = this.stream;
                this.openButton.disabled = true;
                this.closeButton.disabled = false;
                this.captureButton.disabled = false;

                document.getElementById('tapFooterButton').style.display = 'block';
                document.getElementById('preImgCapTure').style.display = 'none';
                document.getElementById('preImgCapTure').src = '';
                document.getElementById('openButton').style.display = 'none';
            })
            .catch(err => {
                console.error('Error accessing the camera:', err);
            });
    },

    closeCamera: function () {
        if (this.stream) {
            const tracks = this.stream.getTracks();
            tracks.forEach(track => track.stop());

            this.video.style.display = 'none';
            this.image.style.display = 'none';
            this.image.src = '';
            this.openButton.disabled = false;
            this.closeButton.disabled = true;
            this.captureButton.disabled = true;

            document.getElementById('tapFooterButton').style.display = 'none';
            document.getElementById('preImgCapTure').style.display = 'none';
            document.getElementById('preImgCapTure').src = '';
            document.getElementById('openButton').style.display = 'block';

        }
    },

    captureImage: function () {
        const context = this.canvas.getContext('2d');
        this.canvas.width = this.video.videoWidth;
        this.canvas.height = this.video.videoHeight;
        context.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);

        const imageData = this.canvas.toDataURL('image/png');
        this.image.src = imageData;

        this.video.style.display = 'none';
        this.image.style.display = 'block';
        this.openButton.disabled = false;

        const tracks = this.stream.getTracks();
        tracks.forEach(track => track.stop());

        document.getElementById('tapFooterButton').style.display = 'none';
        document.getElementById('preImgCapTure').style.display = 'block';
        document.getElementById('openButton').style.display = 'block';
    }
};

// Usage example:
cameraCapture.initialize('cameraFrame');
