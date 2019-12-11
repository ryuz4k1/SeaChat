app.factory('userFactory', ['$http', ($http) => {
	const getUser = (url) => {
		return $http({
			url: url + '/user',
			method: 'GET'
		}).then(response => {
			return response.data;
		}, (err) => {
			console.error(err);
		})
	};

	return {
		getUser
	}
}]);
