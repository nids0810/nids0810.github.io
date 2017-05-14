(function(){

	var app = angular.module('calculateBMI',[]);
	app.controller('BMIcontroller',['$scope',function($scope){

		$scope.current_height = 0;
		$scope.current_weight = 0;

		$scope.calculate = function(){
			var meter = $scope.current_height/100;
			var m2 = meter*meter;
			$scope.bmi = ($scope.current_weight/m2).toFixed(1);

			if($scope.current_height < 1){
				$scope.bmi=0;
			}

			if($scope.current_weight>120){
				alert('please enter correct weight');
				$scope.current_weight = 0;
			}

			$scope.current_msg = 'Calculate your Body Mass Index';

			if($scope.bmi>0 && $scope.bmi<=18.5){
				$scope.current_msg = 'Underweight';
			}
			else if($scope.bmi>18.5 && $scope.bmi<=24.9){
				$scope.current_msg = 'Healthy Range';
			}
			else if($scope.bmi>24.9 && $scope.bmi<=29.9){
				$scope.current_msg = 'Overweight';
			}
			else if($scope.bmi>=30){
				$scope.current_msg = 'Obese';
			}
		}

		$scope.calculate();

	}]);

})();