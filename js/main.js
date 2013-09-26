/*
Jesse Read
1309 - VFW
VFW Project 3
2013-09-19
*/

/* Wait until the DOM is ready */
window.addEventListener("DOMContentLoaded", function(){

	// Retrieve element
	function el(x) {
		var element = document.getElementById(x);
		return element;
	}
	
	function createReleaseSelector() {
		var label = document.createElement('label');
		label.setAttribute("for", "releaseType");
		label.innerHTML = "Release Type:";
		el('releaseArtistLi').appendChild(label);
		var select = document.createElement('select');
		select.setAttribute("id", "releaseType");
		var options = ["Album", "Soundtrack", "EP", "Compilation", "DJ Mix", "Single", "Live album", "Remix", "Bootleg", "Interview", "Mixtape", "Guest Appearance", "Composition"];
		for (i = 0; i < options.length; i++) {
			var option = document.createElement('option');
			option.setAttribute("value", options[i]);
			option.innerHTML = options[i];
			select.appendChild(option);
		}
		el('releaseArtistLi').appendChild(select);
	}
	
	function changeFormat() {
		if (el('addEntry').style.display === "none") {
			el('addEntry').style.display = "inline";
			el('displayLink').style.display = "none";
			document.forms[0].style.display = "none";
		} else {
			el('addEntry').style.display = "none";
			el('displayLink').style.display = "inline";			
			el('frame').removeChild(el('entities'));
			document.forms[0].style.display = "block";
		}
		resetForm();
	}
	
	function removeAllEntities() {
		if (localStorage.length > 0) {
			if (confirm("Remove all entries?")) {
				localStorage.clear();
				alert('All stored data has been removed.');
			}
		} else {
			alert('There are no entries to be removed.');
		}
		if (document.forms[0].style.display === "none") {
			changeFormat();	
		}
	}
	
	function getReleaseArtistValue() {
		var options = document.forms[0].releaseArtists;
		for (var i = 0; i < options.length; i++) {
			if (options[i].checked) {
				return options[i].value;
			}
		}
	}
	
	function isFavorite() {
		if (el('favorite').checked) {
			return "Yes";
		} else {
			return "No";
		}
	}
	
	function addEntity(key){
		if (validateInput()) {
			if (this.key == null) {
				var key = Math.floor(Math.random()*20131104);
			} else {
				var key = this.key;
			}
			var entity = {};
				entity.artistName = ["Album Artist: ", el('artistName').value];
				entity.albumName = ["Album Name: ", el('albumName').value];
				entity.releaseDate = ["Release Date: ", el('releaseDate').value];
				entity.releaseType = ["Release Type: ", el('releaseType').value];
				entity.releaseArtist = ["Release Artists: ", getReleaseArtistValue()];
				entity.songCount = ["Number of songs: ", el('songCount').value];
				entity.opinion = ["Opinion: ", el('opinion').value];
				entity.favorite = ["Favorite: ", isFavorite()];
			localStorage.setItem(key, JSON.stringify(entity))
			alert("Release saved.")
			resetForm();
			
		}
	}

	function retrieveEntities() {
		changeFormat();
		var listingDiv = document.createElement('div');
		listingDiv.setAttribute("id", "entities");
		var entityList = document.createElement('ul');
		entityList.setAttribute("class", "entityList");
		listingDiv.appendChild(entityList);
		el('frame').appendChild(listingDiv);
		for (i = 0; i < localStorage.length; i++) {
			var entityLi = document.createElement('li');
			entityLi.setAttribute("class", "entityList");
			entityLi.setAttribute("id", "listEntry");
			entityList.appendChild(entityLi);
			var entity = JSON.parse(localStorage.getItem(localStorage.key(i)));
			var entityDetails = document.createElement('ul');
			entityDetails.setAttribute("class", "entityList");
			entityLi.appendChild(entityDetails);
			for (var property in entity) {
				var detailLi = document.createElement('li');
				detailLi.setAttribute("class", "entityList");
				detailLi.innerHTML = entity[property][0] + entity[property][1];
				entityDetails.appendChild(detailLi);
			}
			var editLi = document.createElement('li');
			var editLink = document.createElement('a');
			editLink.innerHTML = "Edit Release Details";
			editLink.key = localStorage.key(i);
			editLink.href = "#";
			editLink.addEventListener('click', editRelease);
			editLi.appendChild(editLink);
			entityDetails.appendChild(editLi);
			var deleteLi = document.createElement('li');
			var deleteLink = document.createElement('a');
			deleteLink.innerHTML = "Delete Release";
			deleteLink.key = localStorage.key(i);
			deleteLink.href = "#";
			deleteLink.addEventListener('click', deleteRelease);
			deleteLi.appendChild(deleteLink);
			entityDetails.appendChild(deleteLi);
		}
	}
	
	function editRelease() {
		changeFormat();
	
		var item = JSON.parse(localStorage.getItem(this.key));
		
		el('artistName').value = item.artistName[1];
		el('albumName').value = item.albumName[1];
		el('releaseDate').value = item.releaseDate[1];
		el('releaseType').value = item.releaseType[1];
		/* Release Artist */
		var artistReleaseOptions = document.forms[0].releaseArtists;
		for (var i = 0; i < artistReleaseOptions.length; i++) {
			if(artistReleaseOptions[i].value == "Single Artist" && item.releaseArtist[1] == "Single Artist") {
				artistReleaseOptions[i].setAttribute("checked", "checked");
			} else if(artistReleaseOptions[i].value == "Various Artists" && item.releaseArtist[1] == "Various Artists") {
				artistReleaseOptions[i].setAttribute("checked", "checked");				
			}
		}
		el('songCount').value = item.songCount[1];
		el('opinion').value = item.opinion[1];
		if(item.favorite[1] == "Yes") el('favorite').setAttribute("checked", "checked");
		
		el('submit').value = "Update Release";
		el('submit').key = this.key;
	}
	
	function deleteRelease() {
		if (confirm("Remove release from collection?")) {
			localStorage.removeItem(this.key);
			alert("Release removed.");
			window.location.reload();
		}
	}
	
	function resetForm () {
		el('submit').key = null;
		el('submit').value = "Add Release to Collection";
		el('artistName').value = "";
		el('albumName').value = "";
		el('releaseDate').value = "";
		el('releaseType').value = "";
		/* Release Artist */
		var artistReleaseOptions = document.forms[0].releaseArtists;
		for (var i = 0; i < artistReleaseOptions.length; i++) {
			if(artistReleaseOptions[i].value == "Single Artist"){
				artistReleaseOptions[i].setAttribute("checked", "checked");
			}
		}
		el('songCount').value = 50;
		el('opinion').value = "";
		el('favorite').removeAttribute("checked");
	}
	
	function validateInput() {
		el ('errors').innerHTML = "";
		el('artistName').style.border = "1px solid black";
		el('albumName').style.border = "1px solid black";
		el('releaseDate').style.border = "1px solid black";
		el('releaseType').style.border = "1px solid black";
		
		var errorMsg = [];
		if (el('artistName').value === "") {
			errorMsg.push("Album artist required.")
			el('artistName').style.border = "1px solid red";
		}
		if (el('albumName').value === "") {
			errorMsg.push("Album name required.")
			el('albumName').style.border = "1px solid red";
		}
		if (el('releaseDate').value === "") {
			errorMsg.push("Release date required.")
			el('releaseDate').style.border = "1px solid red";
		}
		if (el('releaseType').value === "") {
			errorMsg.push("Release Type required.")
			el('releaseType').style.border = "1px solid red";
		}
		if (errorMsg.length > 0) {
			for (var i = 0; i < errorMsg.length; i++) {
				var error = document.createElement('li')
				error.innerHTML = errorMsg[i];
				el('errors').appendChild(error);
			}
			return false;
		} else {
			return true;
		}
	}
	
	// Add dropdown menu
	createReleaseSelector();
	
	// Click events
	el('displayLink').addEventListener("click", retrieveEntities);
	el('clearData').addEventListener("click", removeAllEntities);
	el('submit').addEventListener("click", addEntity);
	el('addEntry').addEventListener("click", changeFormat);
	
});