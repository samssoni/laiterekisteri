'use strict'

// Asenna ensin mysql driver 
// npm install mysql --save

var mysql = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',  // HUOM! Älä käytä root:n tunnusta tuotantokoneella!!!!
  password : '',
  database : 'asiakas'
});

module.exports = 
{
    fetchTypes: function (req, res) {  
      connection.query('SELECT Avain, Lyhenne, Selite FROM Asiakastyyppi', function(error, results, fields){
        if ( error ){
          console.log("Virhe haettaessa dataa Asiakas-taulusta, syy: " + error);
          //res.send(error);
          res.json({"status": 500, "error": error, "response": null}); 
        }
        else
        {
          console.log("Data = " + JSON.stringify(results));
          res.statusCode = 200;
          //res.send(results);
          res.json({"status": 100, "error": null, "response": results});
        }
    });

    },

    // Kutsu muodossa localhost:3003/Asiakas/?nimi=kalle&osoite=teku
    // Metodian GET
    fetchAll: function(req, res){
      console.log("query (GET): " + JSON.stringify(req.query));
      // HUOM! Hakuehtoja EI oteta tässä versiossa huomioon

        connection.query('SELECT a.Avain, Nimi, Osoite, Postinro, Postitmp, Luontipvm, asty_avain, at.Lyhenne, at.Selite FROM Asiakas a INNER JOIN Asiakastyyppi at ON at.Avain = a.Asty_avain', function(error, results, fields){
            // error will be an Error if one occurred during the query
            // results will contain the results of the query
            // fields will contain information about the returned results fields (if any)
            if ( error ){
              console.log("Virhe haettaessa dataa Asiakas-taulusta, syy: " + error);
              //res.send(error);
              res.send(JSON.stringify({"status": 500, "error": error, "response": null})); 
            }
            else
            {
              console.log("Data = " + JSON.stringify(results));
              //res.json(results);
              res.statusCode = 200;
              res.send(results);
            }
        });
    },

    // Kutsu muodossa localhost:3003/Asiakas/78
    // Metodian GET
    fetchOne: function(req, res){
      // HUOM! params, EI query!!!
      console.log("query (GET one): " + JSON.stringify(req.params));
        var avain = req.params.id;
        connection.query('SELECT a.Avain, Nimi, Osoite, Postinro, Postitmp, Luontipvm, asty_avain, at.Lyhenne, at.Selite FROM Asiakas a INNER JOIN Asiakastyyppi at ON at.Avain = a.Asty_avain WHERE a.Avain = ?', [avain], 
        function(error, results, fields){
            if ( error ){
              console.log("Virhe haettaessa dataa Asiakas-taulusta, syy: " + error);
              res.json({"status": 500, "error": error, "response": null}); 
            }
            else
            {
              console.log("Data = " + JSON.stringify(results[0]));
              //res.json(results);
              res.statusCode = 200;
              res.send(results[0]);
            }
        });
    },


    // Kutsu muodossa localhost:3003/Asiakas/22 (edellyttäen että reititys on hoidettu niin että Asikas osoittaa tänne)
    // Metodian POST
    // Body-lohkossa tulee muutettavan tietueen data
    create: function(req, res){

        console.log("body (CREATE): " + JSON.stringify(req.body));
        let c = req.body;

        connection.query('INSERT INTO Asiakas (Nimi, Osoite, Postinro, Postitmp, Luontipvm, Asty_avain) VALUES (?, ?, ?, ?, CURDATE(), ?)', [c.Nimi, c.Osoite, c.Postinro, c.Postitmp, c.Asty_avain],
          function(error, results, fields){
          if ( error ){
            console.log("Virhe lisättäessä dataa Asiakas-tauluun, syy: " + error);
            res.json(error);
          }
          else
          {
            console.log("Data = " + JSON.stringify(results));
            res.statusCode = 201;
            c.Avain = results.insertId;
            res.json(c);
          }
      });
    },

    // Kutsu muodossa localhost:3003/Asiakas/22
    // Body-lohkossa tulee muutettavan tietueen data ja id (22) tulee url:n perässä
    // Metodian PUT
    update: function(req, res){

      console.log("body: " + JSON.stringify(req.body));
      console.log("params: " + JSON.stringify(req.params));
      let c = req.body; // Kentät
      let avain = req.params.id;  // Id

      connection.query('UPDATE Asiakas SET Nimi=?, Osoite=?, Postinro=?, Postitmp=?, Asty_avain=? WHERE Avain=?', [c.Nimi, c.Osoite, c.Postinro, c.Postitmp, c.Asty_avain, avain],
        function(error, results, fields){
        if ( error ){
          console.log("Virhe muutettaessa dataa Asiakas-tauluun, syy: " + error);
          res.send(error);
        }
        else
        {
          console.log("Data (UPDATE)= " + JSON.stringify(results));
          res.statusCode = 204;
          res.send();
        }
    });
  },

  // Kutsu muodossa localhost:3003/Asiakas/22 
  // Metodian DELETE
  delete : function (req, res) {
      console.log("body: " + JSON.stringify(req.body));
      console.log("params: " + JSON.stringify(req.params));
      let c = req.body;
      // VAIN tällä parametrilla on merkitystä, muut yllä ovat vain testiä varten
      let avain = req.params.id;

      connection.query('DELETE FROM Asiakas WHERE Avain=?', [avain],
        function(error, results, fields){
        if ( error ){
          console.log("Virhe poistettaessa dataa Asiakas-taulusta, syy: " + error);
          res.send(error);
        }
        else
        {
          console.log("Data (DELETE)= " + JSON.stringify(results));
          res.statusCode = 204; // No content
          res.send();
        }
    });
  }
}
