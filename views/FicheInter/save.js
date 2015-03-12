   <?php
      if (isset($_GET['id']))
      {
        echo "<script src='./js/ModifInter.js'></script>\n
            <script> var id = '{$_GET['id']}';\n</script>";
      }
    ?>
    <script type="text/javascript">

var isinter = (typeof id === 'undefined' ? false : true);
if (isinter == true)
{
  $('#PageLegend').html("Modification D'intervention");

  $('title').html('- ' + id + ' -');
}
else
{
  DivDate = <?php echo "'<h5 style=\"float:left;margin-left: 14px;\" class=\"text-muted hidden-xs\">" . date('d/m : H\hi') . "</h5>'"; ?>;
  $('form').css('visibility', 'visible');
  $('#PageLegend').html(DivDate + "Fiche d'intervention");
  $('title').html('Fiche Inter');
}

function PrenomVisibility(param)
{
     value =  ($.type(param) == 'string' ? param: $(this).val());
    if (value === 'Soc.') 
        $('#prenom').css('visibility', 'hidden');
    else
      $('#prenom').css('visibility', 'visible');
}

   $('#civ_select').change(PrenomVisibility);

    $('.input-group-addon span:not(.glyphicon)').css('font-size', '19px');
      $(window).resize(function () {
         var h = $('#MapDiv').width();
          $('#map-canvas').css('height', h * 0.6);
          $('#map-canvas').css('width', h);
      });
var Timeinput =  $('#timepicker').pickatime({
                            min: [8,0],
                            max: [22,0],
                            format: 'H:i',
                             onStart: function() {
                                var date = new Date();
                                this.set('select', [date.getHours()]);
                            },

                            interval: 30
                           }).removeAttr("readonly");

var Dateinput = $('#datepicker').pickadate({
                              
                              onStart: function() {
                                  var date = new Date();
                                  this.set('select', [date.getFullYear(), date.getMonth(), date.getDate()]);
                              },

                              format: 'ddd d mmmm yyyy',
                               editable: true
                          }).removeAttr("readonly");

function ChangeCheckbox(Cid)
{
  if ($('#' + Cid).is(':checked'))
  {
    $('#' + Cid).prop('checked', false);
  }
  else
  {
    $('#' + Cid).prop('checked', true);
  }
}


$.fn.GetInputFields = function() {
  var $form = this.is("form") ? this : this.find("form"),
    obj = {};
  
  $.each($form.serializeArray(), function() {
    
    if (this.name in obj) {
      // Should be array
      if (!$.isArray(obj[this.name])) {
        obj[this.name] = [obj[this.name]];
      }
      // Push value
      obj[this.name].push(this.value);
    } else {
      // Set value
      obj[this.name] = this.value;
    }

  });
  
  return obj;
};


function CheckForm(result)
{
    console.log(result);
}

var n;


function GetSamedi(Travail_Samedi, CallbackFunction)
{
  if (Travail_Samedi == true)
   { 
    CallbackFunction(42);
    return (0);
   }
          bootbox.dialog({
          message: "Est ce que le SST travail le samedi ? ",
          title: "SMS annulation",
          buttons:
            {
              success: {
                label: "Oui",
                className: "btn-success",
                callback: function () { CallbackFunction(1) }},
              danger: {
                label: "Non",
                className: "btn-danger",
                callback: function () {  CallbackFunction(0) }},
              warning: {
                label: "Je Sais Pas",
                className: "btn-warning",
                callback: function () {  CallbackFunction(42) }}
            }

      });
}


$("#Form").submit(function(e)
{
  NProgress.start() 
  e.preventDefault();
  Result = $(this).GetInputFields();
  if (typeof id !== 'undefined')
    Result.id = id;
  Result.login = <?php echo "'{$_SESSION['login']}'"; ?>;
  Result.date_intervention = Dateinput.pickadate('picker').get('select', 'dd/mm/yyyy'); 
  Result.date_intervention_en = Dateinput.pickadate('picker').get('select', 'yyyymmdd');
  Result.heure_intervention = Timeinput.pickatime('picker').get('select', 'HH:i') + ":00";

  if (Result.id_sst_selectionne > 0 && Stock[GetMarkerFromId(Result.id_sst_selectionne).idsst].travail_samedi != null)
      Deja_Set_Travail_Samedi = true;
  else
      Deja_Set_Travail_Samedi = false;
    GetSamedi(Deja_Set_Travail_Samedi, function(samedi) {
  if (samedi != 42)
    Result.travail_samedi = samedi;
    $.ajax({
      url: './Ajax/AjaxTraitementInter.php',
      type: 'GET',
      data: Result
    })
    .fail(function(jqXHR, data, errorThrown){
      bootbox.alert("Une erreur est Survenu, \nUn mail automatique a été envoyé au Service informatique.", function()
      {$.ajax({ url: './Ajax/AjaxSendErrorMail.php', data: {text:JSON.stringify(data) }});})
      })
    .done(function( data ) {
      try 
      {
       data = $.parseJSON(data.replace(/[^\u0000-\u007E]/g, ""));
      }
      catch (err)
      {
          bootbox.alert("Une erreur est Survenu, \nUn mail automatique a été envoyé au Service informatique.", function()
          {$.ajax({ url: './Ajax/AjaxSendErrorMail.php', data: {text:data }});})
      }
    console.log(data);
    NProgress.done();

    var xurl = <?php
                    include_once("../static/encrypt.php");
                    $now = new DateTime();
                    $ajd = $now->format("d/m/Y");
                      echo "'../5_Gestion_des_interventions/table_new.php" .
                      hsh("token==AND inter.etat_intervention='EN COURS' AND inter.date_ajout='{$ajd}' AND inter.ajoute_par='{$_SESSION['login']}'", $x_key, "cmpt=true") . "'";
                ?> ; 
    var separator = (xurl.indexOf('-') === -1 ? '&' : '?');
    //document.location.href = (xurl  + separator + "data=" + JSON.stringify(data));
    //setTimeout(function(){ n.close(); }, 2000);
   // location.reload();

   //setTimeout(function(){ location.reload(); },900)
    });

  });

});

function ChangeModeReglement(value)
{
      if (value === "facture")
      {
        $('#OnlyWhenFacture').css('display', 'block');
      }
      else
      {
        $('#OnlyWhenFacture').css('display', 'none');
      }
}

$('#Form :input:not(.NotCap)').keyup(function(e)
{
 	 if (e.which < 40 || e.which == 91)
    	return;
  var newValue = $(this).val().toUpperCase();
  $(this).val(newValue);
});


      function stopEnterKey(evt) {
        var evt = (evt) ? evt : ((event) ? event : null);
        var node = (evt.target) ? evt.target : ((evt.srcElement) ? evt.srcElement : null);
        if ((evt.keyCode == 13) && (node.type == "text")) { return false; }
    }

          document.onkeypress = stopEnterKey;




    //localisation tel:
      $("#tel1").keyup(function(){
        var tel = $(this).val();
        if(tel.length >= 6)
        {
          tel = tel.substring(0,6);

          $.ajax({
            url : "./Ajax/AjaxLocalisationTelephone.php",
            contentType : "text",
            data : {tel : tel}
          }).done(function(data){ //data = ville qui correspond au numéro
            if(data.length > 1)
            {
                var geocoder = new google.maps.Geocoder();
                var ville = data;
                var departement = "dep";
                geocoder.geocode(
                  { 'address': ville+' FRANCE'},
                  function(results, status) {

                  if (status == google.maps.GeocoderStatus.OK)
                  {
                    map.setCenter(new google.maps.LatLng(results[0].geometry.location.k, results[0].geometry.location.B));
                    map.setZoom(11); 
                    console.log(results[0]);
                    for(var i=0 ; i<results[0].address_components.length ; i++)
                    {
                      if($.inArray('administrative_area_level_2', results[0].address_components[i].types) != -1)
                      {
                        departement = "(" + results[0].address_components[i].short_name + " - " + results[0].address_components[i].long_name + ")";
                        break;
                      }
                    }
                  }
                  Local = data + " " + departement;
                });
                  Local = data;
            }
            else
            {
              Local = "Inconnu";
            }
          $("#local_tel").text(Local).show('slow'); 

          });
        }
      });


var desktops = document.querySelectorAll('.desktop');

function hide(element) {
  element.style.setProperty('left', '-100%', element.style.getPropertyPriority('left'));
}


function show(element) {
  element.style.setProperty('left', '0', element.style.getPropertyPriority('left'));
}


$("#tel1").blur(function() { $("#local_tel").hide() });
$('nav > ul > li').attr('onclick', 'ClickOnSideBar($(this))');

function ChangeBlueCat(C_ID)
{
  $('nav > ul > li > div').css('color', 'white');
  $('#categorie option[value="' + C_ID + '"]').prop('selected', true);
  $('#' +  C_ID  + ' :nth-child(1)').css('color', 'black');
}

function ClickOnSideBar(elem)
{
  C_ID = elem.attr('id');
  CategorieChange(C_ID);
}
setTimeout(function(){$('.caption').addClass('hidden-sm');}, 3000);


$('input, textarea').attr('autocomplete', 'off');
$('textarea[maxlength]').maxlength({alwaysShow: true});

    </script>