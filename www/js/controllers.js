angular.module('starter.controllers', ['ngCordovaIamport'])

.service('cartService', function() {

  var carts = [];

  return {
    quantity : function() {
      var total = 0;

      angular.forEach(carts, function(item) {
        total += item.qty;
      });

      return total;
    },
    total : function() {
      var amount = 0;
      angular.forEach(carts, function(item) {
        amount += item.amount * item.qty;
      });

      return amount;
    },
    inCart : function(id) {
      var qty = 0;
      angular.forEach(carts, function(item) {
        if ( item.id == id )  qty = item.qty;
      });

      return qty;
    },
    addCart : function(product) {
      var found = false;
      angular.forEach(carts, function(item) {
        if ( item.id == product.id ) {
          item.qty++;
          found = true;
        }
      });

      if ( !found ) {
        carts.push({
          id : product.id, 
          qty : 1,
          amount : product.amount
        });
      }
    }
  }
})

.controller('AppCtrl', function($scope, $ionicModal, $timeout, cartService) {

  $scope.quantity = function() {
    return cartService.quantity();
  }

  $scope.total = function() {
    return cartService.total();
  }
})

.controller('ProductListCtrl', function($scope, $cordovaIamport, cartService) {
  $scope.productlists = [
    { title: '신발',  id: 1, amount: 3000 },
    { title: '티셔츠', id: 2, amount: 2000 },
    { title: '반바지', id: 3, amount: 4000 },
    { title: '스냅백', id: 4, amount: 2500 },
    { title: '넥타이', id: 5, amount: 5000 }
  ];

  $scope.addCart = function(id) {
    angular.forEach($scope.productlists, function(product) {
      if ( product.id == id ) cartService.addCart(product);
    });
  }

  $scope.inCart = function(id) {
    return cartService.inCart(id);
  }

  $scope.checkout = function() {
    var param = {
      pay_method : 'card',
      merchant_uid : 'ionickorea_oid_' + (new Date()).getTime(),
      amount : cartService.total(),
      name : '아이오닉코리아 사은품결제',
      buyer_name : '아임포트',
      buyer_email : 'iamport@siot.do',
      buyer_tel : '010-8598-8832',
      app_scheme : 'ioniciamport'
    };

    $cordovaIamport.payment('imp57843720', param).then(function(result) {
      alert(result.imp_uid + ' 주문이 완료되었습니다.');
    }, function(err) {
      alert(err);
    });
  }

})

;
