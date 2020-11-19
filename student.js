(function(global) {

    // Compatibility
    navigator.getUserMedia_ = (navigator.getUserMedia || navigator.webkitGetUserMedia
     || navigator.mozGetUserMedia || navigator.msGetUserMedia);
  
    var peerClient;
    var currentPeerConnection = [];
    var peers = [];
    var localMediaStream;
    var conn;
    var check_received_stream = false;
  
    $(function() {
  
    var $myselfId = $('#js-myself-id');
    var $peerId = $('#js-peer-id');
    var $partnerId = $('#js-partner-id');
    var $register = $('#js-open');
    var $joinclass = $('#js-connect');
    var leave_class = $('#leave_class');
    var videoMyself = document.querySelector('#js-video-myself');
    var videoPartner = document.querySelector('#js-video-partner');
    var append_pats = document.querySelector('#List_of_Class_Participants');
    var span_student_name = $('#student_name');
    var span_student_reg = $('#student_reg');

    //get the classid from href clink

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const class_id = urlParams.get('class_id');
    const student_peer_id = urlParams.get('student_peer_id');
    const student_name = urlParams.get('student_name');
    const student_reg = urlParams.get('student_id');
    console.log("CLASS ID :" + class_id );
    console.log("STUDENT PEER ID :" + student_peer_id );
    console.log("STUDENT NAME :" + student_name );
    console.log("STUDENT ID :" + student_reg );

    //alert("CLASS ID :" + class_id +" "+student_peer_id+" " +student_name+" student_reg"+student_reg );
    
    //set the values to html
    span_student_name.text(student_name);
    span_student_reg.text(student_reg);

    // set the class peer id field
    $myselfId.val( student_peer_id );
    $partnerId.val(class_id);

    //set the class title
    document.querySelector('#class_session_id').innerHTML = "Class Session: " + class_id;
  
      navigator.getUserMedia_({video: true, audio: true}, function(stream) {
        videoMyself.srcObject = stream;
        videoMyself.play();
        localMediaStream = stream;

      //set the style on permission
        if (window.innerWidth >= 1100  && window.innerWidth > 768 ) {
          document.querySelector('.class_session_id').style.minWidth = '85%';
        }

      });
      
      // create peer object
        var myselfId = $myselfId.val();
        // peerClient = new Peer(myselfId);

        const peerClient = new Peer( myselfId , {
          host: 'localhost',
          port: 9000,
          path: '/myapp'
        });

        // if peer connection is opened
        peerClient.on('open', function() {
          $peerId.html(peerClient.id);
          Swal.fire( "Session Initialized : "+ peerClient.id,"","success");
        });
        
        peerClient.on('call', function(call) {
          // answer with my media stream
          call.answer(localMediaStream);
          var caller = {};
          
          // keep call as currentPeerConnection
          currentPeerConnection = call;

          caller.call = call;
          
          // wait for partner's stream
          call.on('stream', function(stream) {
            //videoPartner.srcObject = stream;
            //videoPartner.play();
            caller.stream = stream;
          });
          
          console.log(caller);
          peers.push(caller);
          //append the caller id to the dom
          append_pats.append( "<li>"+caller.call.peer+"</li>" );

          // if connection is closed
          call.on('close', function() {
            console.log('Connection is closed.');
            Swal.fire( "Class Connection is Ended! ","","error");
          });

        });

        // disable id input
        $myselfId.attr('disabled', 'disabled');
        
        // enable partner id input
        $partnerId.removeAttr('disabled');
        
        // enable connect button
        $joinclass.removeAttr('disabled');
  
      $joinclass.on('click', function(e) {

        // if peerClient is not initialized
        if ( (peerClient._open == false) ) {
          
            Swal.fire({
              icon: 'error',
              type: 'error',
              title: 'Server Not available !',
              text: 'Contact Your Admin.',
              showConfirmButton: false,
              confirmButtonColor: '#F27474',
              timer: 60000
            });

          //enable join class
          document.querySelector('#js-connect').disabled = false;
        }

        else {

          //disable join class
          $joinclass.attr('disabled', 'disabled');

          // connect to partner
          var partnerId = $partnerId.val();
          var call = peerClient.call(partnerId, localMediaStream);
    
          // keep call as currentPeerConnection
          currentPeerConnection = call;
    
          // wait for partner's stream

          call.on('stream', function(stream) {
            videoPartner.srcObject = stream;
            videoPartner.play();

            //console.log(stream);

            //disable the join class
            document.querySelector('#js-connect').disabled = true;

            //enable the leave class
            document.querySelector('#leave_class').disabled = false;

            Swal.fire( "Class "+partnerId+" Joined.","","success");

            // set the stopwatch
            $(".chat-stopwatch").stopwatch().stopwatch("start"); 

            // set the check_received_stream true
            check_received_stream = true; 

          });
        
          //capture stream not received
          if ( check_received_stream == false ) {
            Swal.fire( "Problem Connecting To Class!","","error");

            //disable the join class
            document.querySelector('#js-connect').disabled = false;

            //enable the leave class
            document.querySelector('#leave_class').disabled = true;

          }
    
          // if connection is closed
          call.on('close', function() {
            console.log('Connection is closed.');
            // alert('Class Connection is Ended!');
            Swal.fire( "Class Connection is Ended! ","","error");
            peerClient.destroy();
          });

      //else
      }

      });

      // student leaves the class
      leave_class.on('click', function(e) {

      //Swal.fire sweet alert
        Swal.fire({
            title:"Do you want to Leave this Class " + class_id + " ?",
            showCancelButton:!0,
            confirmButtonText:"Leave Class",
            animation:!1}).then(
        function(e){ if(e.isConfirmed){
        Swal.fire("Left Class!","","success");
        peerClient.destroy();
        }});
        
        //enable the leave class
        document.querySelector('#leave_class').disabled = true;
        console.log( student_name + ': Left Class');

      });

    });

  
  })(this);