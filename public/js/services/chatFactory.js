app.factory('chatFactory', ['$http', ($http) => {
	const getMessages = (roomId, url) => {
		return $http({
			url: url + "/messages/list",
			method: 'GET',
			params: {
				roomId
			}
		}).then(response => {
			return response.data;
		}, (err) => {
			console.error(err);
		})
	};

	return {
		getMessages
	}
}]);
