
            var mixer;
            var videoPreview = document.querySelector('#js-video-myself');
            //var mixerOptions = document.querySelector('#mixer-options');

            // mixerOptions.onchange = function() {
            //     localStorage.setItem('mixer-selected-options', this.value);
            //     location.reload();
            // };
            // if(localStorage.getItem('mixer-selected-options')) {
            //     mixerOptions.value = localStorage.getItem('mixer-selected-options');
            // }

            function updateMediaHTML(html) {
                //videoPreview.parentNode.querySelector('h2').innerHTML = html;
            }

            // document.querySelector('#js-open').onclick = function() {
            //     //this.disabled = true;

            // Start_Class(mixerOptions.value === 'multiple-cameras-customized');
            // alert('infunc');
                  
            // };

            function afterScreenCaptured(screenStream) {
                navigator.mediaDevices.getUserMedia({video: true, audio: true}).then(function(cameraStream) {

                    screenStream.fullcanvas = true;
                    screenStream.width = screen.width; // or 3840
                    screenStream.height = screen.height; // or 2160 

                    cameraStream.width = parseInt((10 / 100) * screenStream.width);
                    cameraStream.height = parseInt((10 / 100) * screenStream.height);
                    cameraStream.top = screenStream.height - cameraStream.height;
                    cameraStream.left = screenStream.width - cameraStream.width;

                    mixer = new MultiStreamsMixer([screenStream, cameraStream]);

                    mixer.frameInterval = 1;
                    mixer.startDrawingFrames();

                    videoPreview.srcObject = mixer.getMixedStream();
                    window.stream_mixer = mixer.getMixedStream();

                    updateMediaHTML('Mixed Screen+Camera!');

                    addStreamStopListener(screenStream, function() {
                        mixer.releaseStreams();
                        videoPreview.pause();
                        videoPreview.src = null;

                        cameraStream.getTracks().forEach(function(track) {
                            track.stop();
                        });
                    });
                });
            }

            function getMixedCameraAndScreen() {
                if(navigator.getDisplayMedia) {
                    navigator.getDisplayMedia({video: true}).then(screenStream => {
                        afterScreenCaptured(screenStream);
                    });
                }
                else if(navigator.mediaDevices.getDisplayMedia) {
                    navigator.mediaDevices.getDisplayMedia({video: true}).then(screenStream => {
                        afterScreenCaptured(screenStream);
                    });
                }
                else {
                    alert('getDisplayMedia API is not supported by this browser.');
                }
            }

            window.Start_Class = function () {
              
              var isCustomized = true;
                
                    if(isCustomized === true) {
                        // var fullCanvasStream = new MediaStream();
                        // cameraStream.getTracks().forEach(function(track) {
                        //     fullCanvasStream.addTrack(track);
                        // });

                        window.Webcam_stream.fullcanvas = true;
                        window.Webcam_stream.width = screen.width; // or 3840
                        window.Webcam_stream.height = screen.height; // or 2160 

                        fullCanvasRenderHandler(window.Webcam_stream, );
                  

                        mixer = new MultiStreamsMixer([window.Webcam_stream]);
                    }
                    else {
                        normalVideoRenderHandler(window.Webcam_stream, '', function(context, x, y, width, height, idx, textToDisplay) {
                            context.font = '30px Georgia';
                            textToDisplay += ' #' + (idx + 1);
                            var measuredTextWidth = parseInt(context.measureText(textToDisplay).width);
                            x = x + (parseInt((width - measuredTextWidth)) / 2);

                            y = height - 40;

                            if(idx == 2 || idx == 3) {
                                y = (height * 2) - 40;
                            }

                            if(idx == 4 || idx == 5) {
                                y = (height * 3) - 40;
                            }
                            
                            context.strokeStyle = 'rgb(255, 0, 0)';
                            context.fillStyle = 'rgba(255, 255, 0, .5)';
                            roundRect(context, x - 20, y - 25, measuredTextWidth + 40, 35, 20, true);
                            var gradient = context.createLinearGradient(0, 0, width * 2, 0);
                            gradient.addColorStop('0', 'magenta');
                            gradient.addColorStop('0.5', 'blue');
                            gradient.addColorStop('1.0', 'red');
                            context.fillStyle = gradient;
                            context.fillText(textToDisplay, x, y);
                        });

                        mixer = new MultiStreamsMixer([window.Webcam_stream, window.Webcam_stream]);

                        // try below three lines to append audio stream!
                        // var audio = await navigator.mediaDevices.getUserMedia({audio: true});
                        // mixer.appendStreams([audio]);

                        // videoPreview.srcObject = mixer.getMixedStream();
                        // window.stream_mixer = mixer.getMixedStream();
                    }

                    mixer.frameInterval = 1;
                    mixer.startDrawingFrames();

                    document.querySelector('#select_webcam').onclick = function() {
                    
                        window.Webcam_stream.fullcanvas = true;
                        window.Webcam_stream.width = parseInt((100 / 100) * screen.width);
                        window.Webcam_stream.height = parseInt((100 / 100) * screen.height);

                        //mixer.appendStreams([cameraStream]);
                        mixer.resetVideoStreams([window.Webcam_stream]);
                        
                    };

                    document.querySelector('#select_screenshare').onclick = function() {
                    
                        // var nullStream = new MediaStream();
                        // mixer.resetVideoStreams([nullStream]);

                        window.screenshare.fullcanvas = true;
                        window.screenshare.width = parseInt((100 / 100) * screen.width);
                        window.screenshare.height = parseInt((100 / 100) * screen.height);

                        //mixer.appendStreams([window.screenshare]);
                        mixer.resetVideoStreams([window.screenshare]);
                        
                    };

                    document.querySelector('#select_blackb').onclick = function select_blackb() {

                        window.black_board_stream.fullcanvas = true;
                        window.black_board_stream.width = parseInt((100 / 100) * screen.width);
                        window.black_board_stream.height = parseInt((100 / 100) * screen.height);

                        //mixer.appendStreams([window.black_board_stream]);
                        mixer.resetVideoStreams([window.black_board_stream]);
                        
                    };

                    window.select_student_str = function () {


                        window.Webcam_stream.fullcanvas = true;
                        window.Webcam_stream.width = parseInt((100 / 100) * screen.width);
                        window.Webcam_stream.height = parseInt((100 / 100) * screen.height);

                        //mixer.appendStreams([cameraStream]);
                        //mixer.resetVideoStreams([window.Webcam_stream]);

                        window.Student_stream.width = parseInt((30 / 100) * window.Webcam_stream.width);
                        window.Student_stream.height = parseInt((30 / 100) * window.Webcam_stream.height);
                        window.Student_stream.top = window.Webcam_stream.height - window.Student_stream.height;
                        window.Student_stream.left = window.Webcam_stream.width - ((window.Student_stream.width)*1);

                        mixer.resetVideoStreams([ window.Webcam_stream, window.Student_stream]);
                        
                    };

                    window.Disconnect_student_Call = function () {

                        window.Webcam_stream.fullcanvas = true;
                        window.Webcam_stream.width = parseInt((100 / 100) * screen.width);
                        window.Webcam_stream.height = parseInt((100 / 100) * screen.height);

                        //mixer.appendStreams([window.black_board_stream]);
                        mixer.resetVideoStreams([window.Webcam_stream]);
                        
                    };

                    videoPreview.srcObject = mixer.getMixedStream();
                    videoPreview.play();
                    window.stream_mixer = mixer.getMixedStream();

                    updateMediaHTML('Mixed Multiple Cameras!');

                    //set the background color
                    videoPreview.style.backgroundColor = '#3B5998';
                    
                    //set the doc #stop-recording').disabled = false
                    document.getElementById('stop-recording').disabled = false;
                    
                    //set the doc #modal_record_options').disabled = false
                    document.getElementById('recoring_options_btn').disabled = false;
            
            }

            function getMixedMicrophoneAndMp3() {
                updateMediaHTML('Select Mp3 file.');

                getMp3Stream(function(mp3Stream) {
                    navigator.mediaDevices.getUserMedia({
                        audio: true
                    }).then(function(microphoneStream) {
                        mixer = new MultiStreamsMixer([microphoneStream, mp3Stream]);
                        // mixer.useGainNode = false;
                        var audioPreview = document.createElement('audio');
                        audioPreview.controls = true;
                        audioPreview.autoplay = true;
                        
                        audioPreview.srcObject = mixer.getMixedStream();

                        videoPreview.replaceWith(audioPreview);
                        videoPreview = audioPreview;

                        var secondsLeft = 6;
                        (function looper() {
                            secondsLeft--;

                            if(secondsLeft < 0) {
                                updateMediaHTML('Mixed Microphone+Mp3!');
                                return;
                            }
                            updateMediaHTML('Seconds left: ' + secondsLeft);
                            setTimeout(looper, 1000);
                        })();

                        var recorder = RecordRTC(mixer.getMixedStream(), {
                            recorderType: StereoAudioRecorder
                        });

                        recorder.startRecording();

                        setTimeout(function() {
                            recorder.stopRecording(function() {
                                audioPreview.removeAttribute('srcObject');
                                audioPreview.removeAttribute('src');
                                audioPreview.src = URL.createObjectURL(recorder.getBlob());
                            });
                        }, 5000)
                    });
                });
            }

            function getMp3Stream(callback) {
                var selector = new FileSelector();
                selector.accept = '*.mp3';
                selector.selectSingleFile(function(mp3File) {
                    window.AudioContext = window.AudioContext || window.webkitAudioContext;
                    var context = new AudioContext();
                    var gainNode = context.createGain();
                    gainNode.connect(context.destination);
                    gainNode.gain.value = 0; // don't play for self

                    var reader = new FileReader();
                    reader.onload = (function(e) {
                        // Import callback function
                        // provides PCM audio data decoded as an audio buffer
                        context.decodeAudioData(e.target.result, createSoundSource);
                    });
                    reader.readAsArrayBuffer(mp3File);

                    function createSoundSource(buffer) {
                        var soundSource = context.createBufferSource();
                        soundSource.buffer = buffer;
                        soundSource.start(0, 0 / 1000);
                        soundSource.connect(gainNode);
                        var destination = context.createMediaStreamDestination();
                        soundSource.connect(destination);

                        // durtion=second*1000 (milliseconds)
                        callback(destination.stream, buffer.duration * 1000);
                    }
                }, function() {
                    document.querySelector('#js-open').disabled = false;
                    alert('Please select mp3 file.');
                });
            }

            // via: https://www.webrtc-experiment.com/webrtcpedia/
            function addStreamStopListener(stream, callback) {
                stream.addEventListener('ended', function() {
                    callback();
                    callback = function() {};
                }, false);
                stream.addEventListener('inactive', function() {
                    callback();
                    callback = function() {};
                }, false);
                stream.getTracks().forEach(function(track) {
                    track.addEventListener('ended', function() {
                        callback();
                        callback = function() {};
                    }, false);
                    track.addEventListener('inactive', function() {
                        callback();
                        callback = function() {};
                    }, false);
                });
            }

            function fullCanvasRenderHandler(stream, textToDisplay) {
                // on-video-render:
                // called as soon as this video stream is drawn (painted or recorded) on canvas2d surface
                stream.onRender = function(context, x, y, width, height, idx) {
                    // context.font = '50px Georgia';
                    // var measuredTextWidth = parseInt(context.measureText(textToDisplay).width);
                    // x = x + (parseInt((width - measuredTextWidth)) - 40);
                    // y = y + 80;
                    // context.strokeStyle = 'rgb(255, 0, 0)';
                    // context.fillStyle = 'rgba(255, 255, 0, .5)';
                    // roundRect(context, x - 20, y - 55, measuredTextWidth + 40, 75, 20, true);
                    // var gradient = context.createLinearGradient(0, 0, width * 2, 0);
                    // gradient.addColorStop('0', 'magenta');
                    // gradient.addColorStop('0.5', 'blue');
                    // gradient.addColorStop('1.0', 'red');
                    //context.fillStyle = gradient;
                    //context.fillText(textToDisplay, x, y);
                };
            }

            function normalVideoRenderHandler(stream, textToDisplay, callback) {
                // on-video-render:
                // called as soon as this video stream is drawn (painted or recorded) on canvas2d surface
                stream.onRender = function(context, x, y, width, height, idx, ignoreCB) {
                    if(!ignoreCB && callback) {
                        callback(context, x, y, width, height, idx, textToDisplay);
                        return;
                    }

                    context.font = '40px Georgia';
                    var measuredTextWidth = parseInt(context.measureText(textToDisplay).width);
                    x = x + (parseInt((width - measuredTextWidth)) / 2);
                    y = (context.canvas.height - height) + 50;
                    context.strokeStyle = 'rgb(255, 0, 0)';
                    context.fillStyle = 'rgba(255, 255, 0, .5)';
                    roundRect(context, x - 20, y - 35, measuredTextWidth + 40, 45, 20, true);
                    var gradient = context.createLinearGradient(0, 0, width * 2, 0);
                    gradient.addColorStop('0', 'magenta');
                    gradient.addColorStop('0.5', 'blue');
                    gradient.addColorStop('1.0', 'red');
                    context.fillStyle = gradient;
                    context.fillText(textToDisplay, x, y);
                };
            }

            /**
             * Draws a rounded rectangle using the current state of the canvas.
             * If you omit the last three params, it will draw a rectangle
             * outline with a 5 pixel border radius
             * @param {CanvasRenderingContext2D} ctx
             * @param {Number} x The top left x coordinate
             * @param {Number} y The top left y coordinate
             * @param {Number} width The width of the rectangle
             * @param {Number} height The height of the rectangle
             * @param {Number} [radius = 5] The corner radius; It can also be an object 
             *                 to specify different radii for corners
             * @param {Number} [radius.tl = 0] Top left
             * @param {Number} [radius.tr = 0] Top right
             * @param {Number} [radius.br = 0] Bottom right
             * @param {Number} [radius.bl = 0] Bottom left
             * @param {Boolean} [fill = false] Whether to fill the rectangle.
             * @param {Boolean} [stroke = true] Whether to stroke the rectangle.
             */
            // via: http://stackoverflow.com/a/3368118/552182
            function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
                if (typeof stroke == 'undefined') {
                    stroke = true;
                }
                if (typeof radius === 'undefined') {
                    radius = 5;
                }
                if (typeof radius === 'number') {
                    radius = {
                        tl: radius,
                        tr: radius,
                        br: radius,
                        bl: radius
                    };
                } else {
                    var defaultRadius = {
                        tl: 0,
                        tr: 0,
                        br: 0,
                        bl: 0
                    };
                    for (var side in defaultRadius) {
                        radius[side] = radius[side] || defaultRadius[side];
                    }
                }
                ctx.beginPath();
                ctx.moveTo(x + radius.tl, y);
                ctx.lineTo(x + width - radius.tr, y);
                ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
                ctx.lineTo(x + width, y + height - radius.br);
                ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
                ctx.lineTo(x + radius.bl, y + height);
                ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
                ctx.lineTo(x, y + radius.tl);
                ctx.quadraticCurveTo(x, y, x + radius.tl, y);
                ctx.closePath();
                if (fill) {
                    ctx.fill();
                }
                if (stroke) {
                    ctx.stroke();
                }
            }

