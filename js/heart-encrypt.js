const bytePieces = [
    '❤️',
    '💛',
    '💙',
    '💜',
    '💖',
    '💘',
    '💝',
    '💟'];
    
    if (!String.prototype.trim) {
      String.prototype.trim = function () {
        return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
      };
    }
    
    function encrypt(message, callback, options) {
      if (!options || !options.characters) {
        options = { characters: bytePieces };
      }
      message = message.trim();
    
      var output = '';
      for (var c = 0; c < message.length; c++) {
        var code = message.charCodeAt(c);
    
        if (code > 255) {
          return callback('ASCII only');
        }
    
        var placeVal = 1;
        while (code > options.characters.length) {
          code /= options.characters.length;
          placeVal++;
        }
        while (placeVal > 0) {
          var index = Math.floor(code);
          output += options.characters[index];
          code = (code - index) * options.characters.length;
          placeVal--;
        }
        output += ' ';
      }
      callback(null, output.trim());
    }
    
    function decrypt(message, callback, options) {
      if (!options || !options.characters) {
        options = { characters: bytePieces };
      }
    
      var output = '';
      var message = message.trim().split(/\s+/);
      for (var c = 0; c < message.length; c++) {
        var code = 0;
        var c2 = 0;
        while (c2 < message[c].length) {
          code *= 10;
          var singleChar = message[c][c2];
          if (options.characters.indexOf(singleChar) > -1) {
            code += options.characters.indexOf(singleChar);
            c2++;
          } else if (c2 + 1 < message[c].length) {
            var doubleChar = singleChar + message[c][c2+1];
            if (options.characters.indexOf(doubleChar) > -1) {
              code += options.characters.indexOf(doubleChar);
              c2 += 2;
            } else {
              c2++;
            }
          } else {
            c2++;
          }
        }
        var code = parseInt(code, options.characters.length);
        output += String.fromCharCode(code);
      }
      callback(null, output);
    }
    
    /*
    encrypt('hello', (err, response) => {
      console.log(response);
    });
    
    decrypt('BFA BEF BFE BFE BFH', (err, response) => {
      console.log(response);
    });
    */
    
    if (typeof module !== 'undefined') {
      module.exports = {
        encrypt: encrypt,
        decrypt: decrypt
      };
    }
    