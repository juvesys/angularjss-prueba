var app = angular.module('pokemones',["ngTable",'ngAnimate', 'ngSanitize', 'ui.bootstrap']);
app.controller("pokemonCtrl",['$scope','$http','NgTableParams','$uibModal',"$log", function($scope,$http,NgTableParams,$uibModal,$log) {

    var items ;
    var pokemoness = [];

    var pc = this;
    pc.datas = "Lorem Name Test";
    pc.img ="";


    pc.open = function (pokemon_name) {
        $scope.detalles = function(details){
            pc.habilidades= [];
            pc.img = details.sprites.front_default;
            pc.name = details.name;
            pc.abilidades = details.abilities;

            pc.abilidades.forEach( function(valor, indice) {
                //console.log(valor.ability.name);
                var ability = valor.ability.name;

                var objeto = {
                     ability,

                };

                pc.habilidades.push(objeto);


            });

            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'myModalContent.html',
                controller: 'ModalInstanceCtrl',
                controllerAs: 'pc',
                //size: size,
                resolve: {
                    data: function () {
                        return {
                            img: pc.img,
                            name: pc.name,
                            habilidades: pc.habilidades
                        };
                    }
                }
            });
            modalInstance.result.then(function () {
                alert("now I'll close the modal");
            });
        }

        $http.get("https://pokeapi.co/api/v2/pokemon/"+pokemon_name+"/").
        then(function(response) {
            $scope.deatils = response.data;

            $scope.detalles($scope.deatils);

        });
        //pc.data = $scope.deatils;




    };

    $http.get('https://pokeapi.co/api/v2/pokemon').
    then(function(response) {
        items = response.data.results;
        $scope.tableParams = new NgTableParams({
            page: 1,
            count: 20,
            noPager: true
        }, {
            counts: [],
            dataset: $scope.pokemones
        });
        items.forEach( function(valor, indice) {
            var url = valor.url;
            var name = valor.name;
            $http.get(url).
            then(function(response) {
                $scope.img = response.data.sprites.front_default;

                var objeto = {
                    "name": name,
                    "src_img":$scope.img
                };

                pokemoness.push(objeto);
                //items = $scope.pokemones;
                //console.log($scope.img);

            });
        });
        $scope.pokemones = pokemoness;

    });


    $scope.title = "POKEMONES";

}]);

app.controller('ModalInstanceCtrl', function ($uibModalInstance, data,$scope) {
    var pc = this;
    pc.name = data.name;
    pc.img = data.img;
    pc.habilidades = data.habilidades;



    pc.ok = function () {
        //{...}
        //alert("You clicked the ok button.");
        $uibModalInstance.close();
    };

    pc.cancel = function () {
        //{...}
        alert("You clicked the cancel button.");
        $uibModalInstance.dismiss('cancel');
    };
});


