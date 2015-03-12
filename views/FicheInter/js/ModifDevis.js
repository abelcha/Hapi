	var EtatInterColor = {
						'A PROGRAMMER' : 'text-primary',
						'EN COURS' : 'text-warning',
						'INTERVENU' : 'text-success',
						'ANNULE' : 'text-danger'
					};


function InterChangeValue(id, field, value)
{
	$.ajax({
				url: './Ajax/AjaxInterChangeValue.php',
				type: 'GET',
				data: {field: field, id:id, value:value},
			});
}


function InterNotFound()
{
	bootbox.dialog({
	  message: "L'inter demandé n'est pas trouvable.",
	  title: "Erreur",
	  buttons: {
	    success: {
	      label: "OK",
	      className: "btn-danger",
	      callback: function() {
	       window.location.replace("http://stackoverflow.com");
	      }
	    }
	  }
	});
}

function ReplaceInput(input, value)
{
	$('#' + input).val(value);
}

function ReplaceSelect(selectId, value)
{
	$('#' + selectId + ' option[value="' + value + '"]').prop('selected', true);
}
var prelines = -1;
function FillDevisLines(Inter)
{
	var devis = $.parseJSON(Inter.devis);
		console.log(devis);
	(devis.devisTab).forEach(function(e, xxcnt) {
		prelines++;
		console.log(prelines);
		    var list = "<tr  id='xli" + xxcnt + "'" + 
                "><td><i onclick='DeleteLine(\"xli" + xxcnt +
                "\")' style='margin:20px;cursor:pointer' class='fa fa-trash fa-2x'></i></td><td class='ref' contenteditable='true' onblur='ActualisePrice(\"#xli" + xxcnt + "\")'>" + e.ref + "</td><td class='desc' contenteditable='true' >" + 
                e.desc + "</td><td class='quant' contenteditable='true' onblur='ActualisePrice(\"#xli" + xxcnt + "\")'>" + e.quantite + "</td>" + 
                "<td onblur='ActualisePrice(\"#xli" + xxcnt + "\")' class='pri' contenteditable='true' >" + e.pu + "</td><td class='tot'>" + (e.pu * e.quantite) + "</td></tr>";
    $('#lols').append(list )
	});
	xxcounter = prelines;
	ReplaceSelect('tva', devis.tva);
	$('#soustotal').html(devis.sous_total);
	$('#total').html(devis.total);
	$('#tva').html(devis.tva);

}

function FillInputs(Inter)
{
	var Field = {
		'lat' :'lat',
		'lng' : 'lng',
		'prenom':'prenom', 
		'nom' : 'nom',
		'tel1' : 'tel1', 
		'tel2' : 'tel2',
		'numero_origine': 'numero_origine',
		'email' : 'email',
		'numero': 'numero',
		'rue': 'adresse', 
		'cp': 'code_postal',
		'ville': 'ville',
	}

	if (Inter.etat_intervention == 'ANNULE')
	{
		$('#AnnulationButton').addClass("btn-info").removeClass("btn-danger").html('Activer');
		$('#AnnulationButton').attr("onclick", "InterChangeValue('" + Inter.id + "', 'etat_intervention', 'A PROGRAMMER');location.reload();");
		$('.rating').rating('refresh', {disabled: true});
		$('input, select, textarea, button[type="submit"]').prop('disabled',true);
	}
	else
		$('#AnnulationButton').attr("onclick", "InterChangeValue('" + Inter.id + "', 'etat_intervention', 'ANNULE');location.reload();");

	for (var key in Field)
	{

		Newval = (key == 'remarque' ? UcWorld(Inter[Field[key]]) : Inter[Field[key]]);
		$('#'+key).val(Newval);
	}
	$('#annul').attr('checked', (Inter.annul == 'Oui' ? 'true' : 'false'));
	$('#A_DEMARCHE').attr('checked', (Inter.A_DEMARCHE == '1' ? 'true' : 'false'));
	ReplaceSelect('type_client', Inter.type_client);
	ReplaceSelect('categorie', Inter.categorie);
	ReplaceSelect('civ_select', Inter.civilite);
/*	ReplaceSelect('mode_reglement', Inter.mode_reglement);
	ReplaceSelect('etat_reglement', Inter.etat_reglement);
	if (Inter.etat_reglement === "PAIEMENT EFFECTUE")
		$('#etat_reglement').attr('disabled', true); */
	ReplaceSelect('age', Inter.yrs_old);
/*	ReplaceSelect('fournisseur', Inter.fournisseur);
	ReplaceSelect('fourniture', Inter.fourniture_sst);*/
	PrenomVisibility(Inter.civilite);
/*
	if (Inter.nom_facture != '')
	{
		$('#reglement_sur_place').prop('checked', true);
		if (Inter.adresse_facture != '')
			$('#facture_geocoder').val(Inter.numero_facture + ' ' + 
									   Inter.adresse_facture + ', ' + 
									   Inter.ville_facture);
		$('#OnlyWhenFacture').css('display', 'block');
	}*/

/*	Dateinput.pickadate('picker').set('select', Inter.date_ajout.split('/').reverse());
	Timeinput.pickatime('picker').set('select', Inter.heure_intervention.slice(0, -3).split(":"));

*/	$('#annul').prop('checked', (Inter.annul == "Oui" ? true : false));
	
/*
	$('#PageLegend').append("<span class='hidden-xs " + EtatInterColor[Inter.etat_intervention] + 
							" EtatInter'><h5>" + Inter.etat_intervention + "</h5></span>");
*/	

	$('#notation_bud').rating('update', Inter.notation_bud);
	$('#notation_flex').rating('update', Inter.notation_flex);
	$('#notation_symp').rating('update', Inter.notation_symp);

	if (newDevis != 'true')
		FillDevisLines(Inter);


	$('form').css('visibility', 'visible');


/*	
	if (Inter.id_sst_selectionne != '0')
		ActualiseContactIcon(Inter.tel1, Inter.id);*/
}

function LoadInterData(CallbackFunction)
{
	$.getJSON('./Ajax/AjaxInterInfo.php', {id: id}, function(Inter)
	{
		if (Inter == null)
			InterNotFound();
		CallbackFunction(Inter);
		FillInputs(Inter);
	}).fail(function(Inter) { console.log(Inter); InterNotFound(); });
}