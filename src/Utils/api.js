// F1 API v6
const F1 = 'https://voxpopuliapp.com/services/'
const securityKey = "ABCDEFG123456";

let api = {
  
  
  postApi(urlpath,data) {  

    let url = F1+urlpath;

    var formappend =  new FormData();
    formappend.append('security_key',securityKey);
       
    for(let formdata in data){
  
      formappend.append(formdata,data[formdata]);
    }


    let options={  
                  method: "POST",
                  headers: {
                    "Content-Type": "multipart/form-data"
                  },
                  body: formappend
            }

    return new Promise(
      function (resolve, reject) {
        fetch(url,options)
        .then(
          function(response) {  

            
            if (response.ok) {  
              
              //alert(JSON.stringify(response)); 
              let responseText = response.json();
             
              resolve(responseText);
            }
            else {   
              //alert(JSON.stringify(response)); 
              console.log('error1',response);
              reject(new Error(`Unable to retrieve events.\nInvalid response received - (${response.status}).`));
            }
          }
        )
        .catch(
          function(error) {
             console.log('error2',error);
            reject(new Error(`Unable to retrieve events.\n${error.message}`));
          }
        );
      }
    ); 


    //return fetch(url,options).then((res) => res.json())
  },
  postUploadApi(urlpath,data,user_id) {  

    let url = F1+urlpath;
  
    var formappend =  new FormData();
    formappend.append('security_key',securityKey);
    formappend.append('user_id',user_id);
       
    for(let formdata in data){


      formappend.append('image_files[]',data[formdata]);
    }
    
      

    console.log(formappend);

    let options={
                  method: "POST",
                  headers: {
                    "Accept":'application/json',
                    "Content-Type": "multipart/form-data"
                  },
                  body: formappend
            }

    return new Promise(
      function (resolve, reject) {
        fetch(url,options)
        .then(
          function(response) {
            if (response.ok) {  
              console.log(response);  
              //alert(JSON.stringify(response)); 
              let responseText = response.json();
              console.log(responseText);
              resolve(responseText);
            }
            else {   
             // alert(JSON.stringify(response)); 
              console.log('error1',response);
              reject(new Error(response));
            }
          }
        )
        .catch(
          function(error) {
             console.log('error2',error);
            // alert(JSON.stringify(error));
            reject(new Error(`Unable to retrieve events.\n${error.message}`));
          }
        );
      }
    ); 


    //return fetch(url,options).then((res) => res.json())
  },
  postApiText(urlpath,data) {
   
    let url = F1+urlpath;

    var formappend =  new FormData();
    formappend.append('security_key',securityKey);
    
    for(let formdata in data){

      formappend.append(formdata,data[formdata]);
    }
    
    //console.log(formappend);
    let options={
        method: "POST",
        headers: {
          "Accept":'application/json',
          "Content-Type": "multipart/form-data"
        },
        body: formappend
    }


    return fetch(url,options).then((res) => res.text())
  },
  getDriverStandings() {
    const url = `${F1}/current/driver-standings`

    return fetch(url).then((res) => res.json())
  },
  getConstructorStandings() {
    const url = `${F1}/current/constructor-standings`

    return fetch(url).then((res) => res.json())
  },
  getQualifyingResults(season, round) {
    const url = `${F1}/results/season/${season}/round/${round}/qualifying`

    return fetch(url).then((res) => res.json())
  },
  getRaceResults(season, round) {
    const url = `${F1}/results/season/${season}/round/${round}/race`

    return fetch(url).then((res) => res.json())
  },
  getConstructorDetails(constructorId) {
    const url = `${F1}/constructor/${constructorId}/details`

    return fetch(url).then((res) => res.json())
  },
  getConstructorDrivers(constructorId) {
    const url = `${F1}/constructor/${constructorId}/drivers/details`

    return fetch(url).then((res) => res.json())
  },
  getCircuitInfo(circuitId) {
    const url = `${F1}/circuit/${circuitId}/details`

    return fetch(url).then((res) => res.json())
  }
}

module.exports = api
