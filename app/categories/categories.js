'use strict';

angular.module('bby-query-mixer.categories').controller('CategoriesCtrl', [
    '$scope',
    'HttpClientService',
    'GaService',
    'categoryResponseConfig',
    function ($scope, HttpClientService, GaService, categoryResponseConfig) {

        $scope.searchOptions = [
            {text:"Choose a seach option", value:""},        
            {text:"All Categories", value:"allcategories"},
            {text:"Top Level Categories", value:"toplevelcategories"},
            {text:"Search By Category Name", value:"categoryname"},
            {text:"Search By Category Id", value:"categoryid"},
            {text:"Search By Category Name and/or Id", value:"multiplecategoryparams"},
        ];

        $scope.buildRemixQuery = function () {
            var queryUrl = 'http://api.remix.bestbuy.com/v1/categories';

            
            var queryParams = '?';
            var addKey = $scope.apiKey ? queryParams += 'apiKey=' + $scope.apiKey : '';
            queryParams += '&format=json&callback=JSON_CALLBACK';

            return queryUrl + queryParams;
        };

        $scope.buildParams = function () {
           
        };

        $scope.invokeRemixQuery = function () {
            $scope.results = "Running";
            var query = $scope.buildRemixQuery();

            var successFn = function (value) {
                $scope.results = value;
            };
            var errorFn = function (httpResponse) {
                $scope.results = httpResponse;
            };

            if (($scope.apiKey !==  "")&($scope.searchSelection.value !== '')){
                $scope.errorResult = false;

                var eventActionName = "categories query success";
                GaService.clickQueryButtonEvent(eventActionName, $scope.apiKey);

                HttpClientService.httpClient(query).jsonp_query(successFn, errorFn);
            }else if ($scope.apiKey ===  ""){
                $scope.errorResult = true;
                $scope.results = "Please enter your API Key";
            } else {
                $scope.errorResult = true;
                $scope.results = "Please pick a search option";
            };
        };

        $scope.categoryResponse = {};

        $scope.resetParams = function () {
            $scope.categoryResponse.list = [];
            $scope.categoryResponses = angular.copy(categoryResponseConfig);
            $scope.searchSelection = $scope.searchOptions[0];
        };
        //calling the function here loads the defaults on page load
        $scope.resetParams();

        $scope.addAllOptions = function(optionArray) {
            var newArray = [];
            angular.forEach(optionArray, function(i) { this.push(i.value) }, newArray);
            return newArray;
        };

        $scope.selectAll = function (z) {
            if (z === 'categoryAttributes') {
                $scope.categoryResponse.list = $scope.addAllOptions($scope.categoryResponses);
            } else if (z === 'noResponse'){
                $scope.categoryResponse.list = [];
            }
            return;
        };

    }
]);
