app.controller('chatController', ['$scope',"userFactory" ,"chatFactory", "$http", ($scope, userFactory ,chatFactory, $http) => {
	/**
	 * initialization
	 */


	const connectSocket = (url) => {
		return new Promise((resolve, reject) => {
			
		});
	};

	const getConfig = () => {
		return new Promise((resolve, reject) => {
			$http.get('/enviroment').then((data) => {
				resolve(data);
			}).catch((err) => {
				reject(err);
			});
		});
	};
	
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
    
	//const socket = io.connect("http://localhost:5000");

	// ... Socket Connection Options
	const connectionOptions = {
		reconnectionAttempts:3,
		reconnectionDelay:500
	};

	getConfig().then(config => {
		userFactory.getUser(config.data.socketUrl).then(user => {
			$scope.user = user;
		});

		const socket = io.connect(config.data.socketUrl);
			
		// ... If socket connect return socket
		socket.on('connect', () => {
			socket.on('onlineList', users => {
				//console.log("User list : " , users);
				$scope.onlineList = users;
				$scope.$apply();
			});
		
			socket.on('roomList', rooms => {
				$scope.roomList = rooms;
				$scope.$apply();
			});
			
		
			$scope.newMessage = () => {
				if ($scope.message.trim() !== '') {
					socket.emit('newMessage', {
						message: $scope.message,
						roomId: $scope.roomId
					});
		
					$scope.messages[$scope.roomId].push({
						userId: $scope.user._id,
						username: $scope.user.name,
						surname: $scope.user.surname,
						message: $scope.message
					});
		
					$scope.message = '';
				}
			};
		
			socket.on('receiveMessage', data => {
				$scope.messages[data.roomId].push({
					userId: data.userId,
					username: data.username,
					surname: data.surname,
					message: data.message
				});
				$scope.$apply();
			});
			
			$scope.switchRoom = room => {
				$scope.chatName = room.name;
				$scope.roomId = room.id;
		
				$scope.chatClicked = true;
		
				if (!$scope.messages.hasOwnProperty(room.id)) {
		
					chatFactory.getMessages(room.id,config.data.socketUrl).then(data => {
						$scope.messages[room.id] = data;
						$scope.loadingMessages = false;
					})
				}
			};
			
		
			$scope.newRoom = () => {
				//let randomName = Math.random().toString(36).substring(7);
		
				let roomName = window.prompt("Enter room name");
				if (roomName !== '' && roomName !== null) {
					socket.emit('newRoom', roomName);
				}
			};
		});
		// ... Else return error
		socket.on('connect_error', () => {
			reject(new Error('connect_error'));
		});
	});
}]);