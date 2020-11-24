        function captureUserMedia(mediaConstraints, successCallback, errorCallback) {
            navigator.mediaDevices.getUserMedia(mediaConstraints).then(successCallback).catch(errorCallback);
        }

        var videosContainer = document.getElementById('videos-container');

        var mRecordRTC = new MRecordRTC();
        mRecordRTC.mediaType = {
            audio: true, // or StereoAudioRecorder or MediaStreamRecorder (WebAssembly also supports audio-encoding however not implemented in WebAssemblyRecorder YET)
            video: true  // or WhammyRecorder      or MediaStreamRecorder or WebAssemblyRecorder or CanvasRecorder
        };

        if (DetectRTC.browser.name === 'Edge') {
            // Microsoft Edge currently supports only audio and gif recording
            mRecordRTC.mediaType = {
                audio: StereoAudioRecorder
            };
        }
        // mRecordRTC.bufferSize = 16384;

        window.start_recording = function() {
            document.querySelector('#start').disabled = true;
            document.querySelector('#stop').disabled = false;

            // captureUserMedia({
            //     audio: true,
            //     video: true
            // }, function(stream) {

            //     var video = document.createElement('video');
            //     video.autoplay = true;
            //     video.srcObject = stream;

            //     var mediaElement = getMediaElement(video, {
            //         buttons: [],
            //         showOnMouseEnter: false,
            //         enableTooltip: false,
            //         onMuted: function() {
            //             document.querySelector('#audio').muted = true;
            //         },
            //         onUnMuted: function() {
            //             document.querySelector('#audio').muted = false;
            //             document.querySelector('#audio').play();
            //         }
            //     });
            //     videosContainer.appendChild(mediaElement);

            //     mRecordRTC.addStream(stream);
            //     mRecordRTC.startRecording();
            // }, function(error) {
            //     alert(JSON.stringify(error));
            // });

            mRecordRTC.addStream(window.stream_mixer);
            mRecordRTC.startRecording();

        };

        window.stop_recording = function() {
            document.querySelector('#stop').disabled = true;

            mRecordRTC.stopRecording(function(url, type) {
                // comment to avoid playing the video
                // document.querySelector(type).srcObject = null;
                // document.querySelector(type).src = url;
                // document.querySelector(type).play();

                // fixing firefox playback issue
                if (!!navigator.mozGetUserMedia) {

                    document.querySelector(type).onended = function() {
                        // comment to avoid playing the video
                        // document.querySelector(type).srcObject = null;
                        // document.querySelector(type).src = URL.createObjectURL(mRecordRTC.getBlob()[type]);
                        // document.querySelector(type).play();
                    };
                }

                mRecordRTC.writeToDisk();
                save.disabled = false;
            });
        };

        document.getElementById('save').onclick = function() {
            this.disabled = true;
            mRecordRTC.save();
            document.querySelector('#start').disabled = false;
        };

        document.getElementById('stop-recording').onclick = function() {
            
            //Swal.fire sweet alert
            Swal.fire({
                title:"Do you want to Stop this Class?",
                showCancelButton:!0,
                confirmButtonText:"End Class",
                animation:!1}).then(
            function(e){ if(e.isConfirmed){

            //disable the stop recording
            document.getElementById('stop-recording').disabled = true;

            //disable the record options modal
            document.getElementById('recoring_options_btn').disabled = true;

            //swal prompt
            Swal.fire("Class Stopped!","","success");

            //set  3 seconds after for disable
            setTimeout(function () {
                        this.disabled = true;
                    }, 3000);
            window.stop_recording();
            
            document.querySelector('#start').disabled = false;
            //stop the recording
            $('#loading').removeAttr('hidden');
            setTimeout(function () { 

                mRecordRTC.save();
                
                $("#loading").attr("hidden", true);
                }, 2000);

            //stop the stop-watch
            $(".chat-stopwatch").stopwatch().stopwatch("stop");

            }});

        };



        document.querySelector('#get').onclick = function() {
            this.disabled = true;

            !!navigator.webkitGetUserMedia && MRecordRTC.getFromDisk('all', function(dataURL, type) {
                if (!dataURL) return;

                if (type == 'audio') {

                    document.querySelector('#audio').src = dataURL;
                }
                if (type == 'video') {
                    var video = document.createElement('video');
                    video.src = dataURL;
                    var mediaElement = getMediaElement(video, {
                        buttons: ['mute-video'],
                        showOnMouseEnter: false,
                        enableTooltip: false,
                        onMuted: function() {
                            document.querySelector('#audio').muted = true;
                        },
                        onUnMuted: function() {
                            document.querySelector('#audio').muted = false;
                            document.querySelector('#audio').play();
                        }
                    });
                    // videosContainer.appendChild(mediaElement);
                    // document.querySelector('#audio').play();
                    // mediaElement.media.play();
                }

                if (type == 'gif') {
                    // var gifImage = document.createElement('img');
                    // gifImage.src = dataURL;
                    // videosContainer.appendChild(gifImage);
                }
            });

            !!navigator.mozGetUserMedia && MRecordRTC.getFromDisk('video', function(dataURL) {
                if (!dataURL) return;

                var video = document.createElement('video');
                video.src = dataURL;
                var mediaElement = getMediaElement(video, {
                    buttons: ['mute-video'],
                    showOnMouseEnter: false,
                    enableTooltip: false,
                    onMuted: function() {
                        mediaElement.muted = true;
                    },
                    onUnMuted: function() {
                        mediaElement.muted = false;
                        mediaElement.play();
                    }
                });
                // videosContainer.appendChild(mediaElement);
                // mediaElement.media.play();
            });
        };

        window.addEventListener('beforeunload', function() {
            document.querySelector('#start').disabled = true;
            document.querySelector('#stop').disabled = true;
            document.querySelector('#get').disabled = true;
        }, true);