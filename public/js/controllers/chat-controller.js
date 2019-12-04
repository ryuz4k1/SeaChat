app.controller('chatController', ['$scope', ($scope) => {

    /**
	 * Angular variables
	 */
	$scope.onlineList = [];
	$scope.roomList = [];
	$scope.activeTab = 1;
	$scope.chatClicked = false;
	$scope.loadingMessages = false;
	$scope.chatName = "";
	$scope.roomId = "";
	$scope.message = "";
	$scope.messages = [];

	$scope.user = {};


    $scope.changeTab = (tab) => {
		$scope.activeTab = tab;
	};
    
    const socket = io.connect("http://localhost:5000");

    socket.on('onlineList', users => {
        console.log(users);
		$scope.onlineList = users;
		$scope.$apply();
    });

    socket.on('roomList', rooms => {
		$scope.roomList = rooms;
		$scope.$apply();
    });
    
    $scope.switchRoom = room => {

		$scope.chatClicked = true;

		
	};
    

    $scope.newRoom = () => {
		//let randomName = Math.random().toString(36).substring(7);

		let roomName = window.prompt("Enter room name");
		if (roomName !== '' && roomName !== null) {
			socket.emit('newRoom', roomName);
		}
    };
    
}]);