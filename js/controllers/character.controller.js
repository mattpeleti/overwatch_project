angular.module('overwatch_project').controller(
  'CharacterController', ['$scope', 'Character', function($scope, Character){
    //Set up the characters so that I can call on them later without getting errors
    $scope.character1 = "Empty"
    $scope.character2 = "Empty"
    $scope.img_path = "css/overwatch-logo.jpg"

    $(function(){
      //If the search option is submitted, we need to create 1 or 2 users without refreshing the page
      $("form").submit(function(){
        if ($("#characterSelect").val().toLowerCase() === "none") {
          vid = "css/CharacterVid/reinhardt.webm"
        }
        else if ($("#characterSelect").val().toLowerCase() === "soldier: 76") {
          vid = "css/CharacterVid/soldier76.webm"
        } else {
          vid = "css/CharacterVid/" + $("#characterSelect").val().toLowerCase() + ".webm"
        }
        $("#source")[0].src = vid
        $('#video')[0].pause()
        $('#video')[0].load()
        $("#video").css("display", "block")
        $(".user_data").css("display", "none")
        $(".character_data").css("display", "none")
        $("#add_user").css("display", "none")
        $("#logo").css("display", "none")

        $scope.character1.fullyLoaded = false
        $scope.character2.fullyLoaded = false
        if ($("#characterSelect").val() !== "None"){
          $scope.character_name = $("#characterSelect").val()
          $("form").css("margin", "0 auto")
          event.preventDefault()
          createCharacters()
        }
      })
      //Create the users - set them up in $scope, see user.js for model details
      function createCharacters(){
        char_name = $("#characterSelect").val().toLowerCase()
        $scope.character1 = new Character($("#inputUser1").val().replace("#", "-"), char_name)
        if ($("#inputUser2").val() !== ""){
          $scope.character2 = new Character($("#inputUser2").val().replace("#", "-"), char_name)
        }
      }
      $("#scope_c").click(function(){
        console.log($scope);
      })
    })

    $scope.$watch('[character1.fullyLoaded, character2.fullyLoaded]', function(){
        if ($scope.character1.fullyLoaded && ($scope.character2.fullyLoaded || $("#inputUser2").val() === "")){
          getCharacterData()
        }
        else {

        }
    })
    //Grabs the keys for any given dictionary and returns them in array form
    getKeys = function(data){
      let keys = []
      for (stat in data){
        keys.push(stat)
      }
      return keys.sort()
    }
    //Takes in an array, returns that array without duplicate entries
    uniq = function (a) {
      return a.sort().filter(function(item, pos, ary) {
          return !pos || item != ary[pos - 1];
      })
    }

    // If one character has data the other doesn't, fills in that data for the other with "N/A"
    getCharacterData = function(){
      if ($("#inputUser2").val() !== ""){
        let character1gk = getKeys($scope.character1.data.general_stats)
        let character2gk = getKeys($scope.character2.data.general_stats)

        let a_general_keys = uniq(character1gk.concat(character2gk))

        //Now we know all the stats we want to display, so put that in scope
        $scope.a_general_keys = a_general_keys

        for (let i = 0; i < a_general_keys.length; i++){
          if (!character1gk.includes(a_general_keys[i])){
            $scope.character1.data.general_stats[a_general_keys[i]] = ["n/a", 'black']
            $scope.character2.data.general_stats[a_general_keys[i]] = [$scope.character2.data.general_stats[a_general_keys[i]]]
          }
          if (!character2gk.includes(a_general_keys[i])){
            $scope.character2.data.general_stats[a_general_keys[i]] = ["n/a", 'black']
            $scope.character1.data.general_stats[a_general_keys[i]] = [$scope.character1.data.general_stats[a_general_keys[i]]]
          }
          if (character1gk.includes(a_general_keys[i]) && character2gk.includes(a_general_keys[i])) {
            if (isNumeric($scope.character1.data.general_stats[a_general_keys[i]]) || !$scope.character1.data.general_stats[a_general_keys[i]].includes(":")) {
              if(+parseFloat($scope.character1.data.general_stats[a_general_keys[i]]).toFixed(2) === +parseFloat($scope.character2.data.general_stats[a_general_keys[i]]).toFixed(2)) {
                $scope.character1.data.general_stats[a_general_keys[i]] = [numberWithCommas(+parseFloat($scope.character1.data.general_stats[a_general_keys[i]]).toFixed(2)), 'black']
                $scope.character2.data.general_stats[a_general_keys[i]] = [numberWithCommas(+parseFloat($scope.character2.data.general_stats[a_general_keys[i]]).toFixed(2)), 'black']
              }
              else if (parseFloat($scope.character1.data.general_stats[a_general_keys[i]]) > parseFloat(+$scope.character2.data.general_stats[a_general_keys[i]])) {
                $scope.character1.data.general_stats[a_general_keys[i]] = [numberWithCommas(+parseFloat($scope.character1.data.general_stats[a_general_keys[i]]).toFixed(2)), 'green']
                $scope.character2.data.general_stats[a_general_keys[i]] = [numberWithCommas(+parseFloat($scope.character2.data.general_stats[a_general_keys[i]]).toFixed(2)), 'red']
              }
              else {
                $scope.character1.data.general_stats[a_general_keys[i]] = [numberWithCommas(+parseFloat($scope.character1.data.general_stats[a_general_keys[i]]).toFixed(2)), 'red']
                $scope.character2.data.general_stats[a_general_keys[i]] = [numberWithCommas(+parseFloat($scope.character2.data.general_stats[a_general_keys[i]]).toFixed(2)), 'green']
              }
            }
          }
        }

      }
      else{
        $scope.a_general_keys = getKeys($scope.character1.data.general_stats)
      }
      setTimeout(function() {
        $("#video").css("display", "none")
        $("#add_user").css("display", "block")
        $("#logo").css("display", "block")
        $(".user_data").css("display", "block")
        $(".character_data").css("display", "block")
        $("#display_char")[0].scrollIntoView()
      }, 2000);


      function numberWithCommas(n) {
          var parts=n.toString().split(".");
          return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1] : "");
        }
      function isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
      }
    }
    $scope.removeUnderscore = function(str){
      while (str.includes("_")){
        str = str.replace("_", " ")
      }
      return str
    }
  }])
