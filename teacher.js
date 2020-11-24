(function (global) {

// Compatibility
    navigator.getUserMedia_ = (navigator.getUserMedia || navigator.webkitGetUserMedia
        || navigator.mozGetUserMedia || navigator.msGetUserMedia);

    var peerTeacher;
    var currentPeerConnection;
    var peers = [];
    var peerConnections = [];
    var localMediaStream;

// Streams
    window.Webcam_stream;
    window.screenshare;
    window.black_board_stream = null;
    window.Student_stream = null;

    $(function () {

        var $myselfId = $('#js-myself-id');
        var $peerId = $('#js-peer-id');
        var $partnerId = $('#js-partner-id');
        var $createKlass = $('#js-open');

        var videoMyself = document.querySelector('#js-video-myself');
        var jsvideomyselfscreen = document.querySelector('#js-video-myself-screen');
        var videoPartner = document.querySelector('#js-video-partner');
        var black_board_canvas = $("#Black_Board_Canvas");
        var stop_class = $("#stop-recording");

        //disable the record options modal
        document.getElementById('recoring_options_btn').disabled = true;

        //set the doc #stop-recording').disabled = false stop recording button
        document.getElementById('stop-recording').disabled = true;

//get the classid from href clink
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const class_id_url = urlParams.get('class_id');
        console.log("CLASS ID :" + class_id_url);

// set the class peer id field
        $myselfId.val(class_id_url);

//function captureWebcam_Audio()
        navigator.getUserMedia_({video: true, audio: true}, function (stream) {
            localMediaStream = stream;
            window.Webcam_stream = stream;
            // videoMyself.srcObject = window.Webcam_stream;
            // videoMyself.play();
        });

//function captureAudio Plus Screen()

        document.getElementById("js-open").onclick = function () {
            navigator.mediaDevices.getDisplayMedia({
                video: true
            }).then(stream => {
                navigator.mediaDevices.getUserMedia({audio: true}).then(function (mic) {
                    stream.addTrack(mic.getTracks()[0]);
                    //jsvideomyselfscreen.srcObject = stream;
                    //jsvideomyselfscreen.play();
                    localMediaStream = stream;
                    window.screenshare = stream;

// start class
                    $('#loading').removeAttr('hidden');
                    setTimeout(function () {
                        window.Start_Class();
                        $("#loading").attr("hidden", true);
                    // set the stopwatch
                    $(".chat-stopwatch").stopwatch().stopwatch("start");
                    }, 3000);

                });
            }).catch(function (error) {
                console.log(error);
            });

            //set  3 seconds after for disable
            setTimeout(function () {
                        $createKlass.attr('disabled', 'disabled');
                    }, 3000);

        // set the start record button diasabled
        document.querySelector('#start').disabled = false;

        }

// get the black board canvas stream
// get the user agent

        const sUsrAg = navigator.userAgent;
        if (sUsrAg.indexOf('Firefox') > -1) {
        //console.log('Firefox');
            var canvas = $('.drawing-board-canvas');
            window.black_board_stream = canvas[0].captureStream(100);

        } else {
        //console.log('Other User Agent');
            var canvas = $('.drawing-board-canvas');
            window.black_board_stream = canvas[0].captureStream(100);

        }

        $createKlass.on('click', function (e) {
// create peer object with server details
            var myselfId = $myselfId.val();
            peerTeacher = new Peer(myselfId);

            // const peerTeacher = new Peer( myselfId , {
            //   host: 'localhost',
            //   port: 9000,
            //   path: '/myapp'
            // });

// capture server not available
            if ( (peerTeacher._open == false)	) {

				Swal.fire({
					icon: 'error',
					title: 'Server Not available !',
					html: 'Contact Your Admin.',
					timer: 600000,
					animation:!1,
					onBeforeOpen: () => {
					Swal.showLoading()
					}
				}).then( function(e){ 
		          document.querySelector('#js-open').disabled = false;
		          });

    			document.querySelector('.swal2-loader').style.borderColor =
    			 '#F27474 transparent #F27474 transparent';

            }

// if peer connection is opened
            peerTeacher.on('open', function () {
                Swal.fire( "Class "+peerTeacher.id+" Is Active","","success");
                $peerId.html(peerTeacher.id);

                //set the class title
                document.querySelector('#class_session_id').innerHTML = "Class Session : " + peerTeacher.id;
            });

// answer with my media stream
            peerTeacher.on('call', function (call) {
            call.answer(window.stream_mixer);

            var caller = {};

    peerConnections[call.peer] = {call: call, stream: {}};

    /*$(`<a href=""><li id = "list_item_` + call.peer + `"> 
        <label class="select_student_str btn btn-primary" id = "`
         + call.peer + `" > Broadcast ` + call.peer + ` </label> 
         .<button id="Disconnect_student_Call" alt = "` + call.peer + `" 
         class="btn btn-danger">End Call:</button> <button id="chat_student" alt = "`
        + call.peer + `" class="btn btn-info">Chat( N ):</button> </li></a>`).
    appendTo('#List_of_Class_Participants'); */

    var now = new Date();
    var h = now.getHours();
    var m = addZero(now.getMinutes());
    var s = addZero(now.getSeconds());

    if (h > 12)
        h -= 12;
    else if (h === 0)
        h = 12;
    function addZero(t) {
        if (t < 10)
            t = "0" + t;
        return t;
    };

    var template = `<li class="list-group-item unread-chat">
                    <figure class="avatar avatar-state-success mr-3">
                        <span class="avatar-title bg-secondary rounded-circle">`
                        +call.peer.charAt(0)+`</span>
                    </figure>
                    <div class="users-list-body">
                        <div>
                            <h5>`+call.peer+`</h5>
                            <p>Messages from Student.</p>
                        </div>
                        <div class="users-list-action">
                            <div class="new-message-count"></div>
                            <small>` + h + ":" + m + ":" + s + `</small>
                            <div class="action-toggle">
                                <div class="dropdown">
                                    <a data-toggle="dropdown" href="#">
                                        <i class="mdi mdi-dots-horizontal"></i>
                                    </a>
                                    <div class="dropdown-menu dropdown-menu-right">
                                    <div class="dropdown-item bg-success select_student_str" 
                                    id = "`+call.peer+`" >
                                        <i class="mdi mdi-video-outline"></i>
                                    </div>
                                    <div class="dropdown-item bg-danger" style="font-size: 11px;"
                                    id="Disconnect_student_Call" alt = "`+call.peer+`" >End</div>
                                    <a href="#" class="dropdown-item">Open Chat</a>
                                    <div class="dropdown-divider"></div>
                                    <a href="#" class="dropdown-item text-danger example-delete-chat">
                                        Report Student</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </li>`;   
    $( template ).appendTo('#List_of_Class_Participants');
    //console.log(template);

// wait for partner's stream
                call.on('stream', function (stream) {
                //videoPartner.srcObject = stream;
                //videoPartner.play();
                //caller.stream = stream;
                let peerx = peerConnections[call.peer];
                peerx.stream = stream;
                peerConnections[call.peer] = peerx;

                });
                //console.log( caller );
                console.log('Student ' + call.peer + ' Joined Class.');

// if connection is closed
            call.on('close', function () {
                console.log(call.peer + ': Closed Connection.');

                //peerConnections[call.peer] = null;
                peerConnections = peerConnections.filter(peercon => {
                    peercon.call.peer != call.peer;
                });
                //console.log(peerConnections);

                //select and remove student html elements
                var select = '#' + call.peer;
                $(select).remove();
                var select2 = '#list_item_' + call.peer;
                $(select2).remove();

                //capture closed call
                Swal.fire( "Call Closed " + peerTeacher.id + " !","","error");

            });

            stop_class.on('click', function (e) {
                peerTeacher.destroy();
                console.log('Stopped Class.');
            });

            $('.select_student_str').on('click', function (e) {
                e.preventDefault();
                e.stopPropagation();

                let p = peerConnections[$(this).attr('id')];
                //videoStudent.srcObject = p.stream;
                //videoStudent.play();
                window.Student_stream = p.stream;
                window.select_student_str();

                $(this).removeClass("btn btn-primary");
                $(this).addClass("btn btn-success");
            })
            $('#Disconnect_student_Call').on('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                window.Disconnect_student_Call();
                var id = "#" + $(this).attr('alt');
                $(id).removeClass("btn btn-success");
                $(id).addClass("btn btn-primary");
            })
        });

// disable id input
            $myselfId.attr('disabled', 'disabled');

// enable partner id input
            $partnerId.removeAttr('disabled');

        });

    });

})(this);