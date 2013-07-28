@if (0===0) @end/*
:: ----------------------------------------------------------
:: atc - Template Compiler Tools[CMD] v1.0
:: https://github.com/cdc-im/atc
:: Released under the MIT, BSD, and GPL Licenses
:: ----------------------------------------------------------

@echo off
title loading..
cd %~dp0
call CScript.EXE "%~dpnx0" //Nologo //e:jscript %*
title Compile Tools
goto cmd
*/

// ÉèÖÃÇ°¶ËÄ£°å¸ùÄ¿Â¼
var $path = './templates/';

// ÉèÖÃ´ý´¦ÀíµÄÄ£°æ±àÂë
var $charset = 'UTF-8';

// ÉèÖÃ¸¨Öú·½·¨±àÒë·½Ê½(ÎªtrueÔò¿ËÂ¡µ½Ã¿¸ö±àÒëºóµÄÎÄ¼þÖÐ£¬ÎªfalseÔòµ¥¶ÀÊä³öµ½ÎÄ¼þ)
var $cloneHelpers = false;

// Ä£°åÒýÇæÂ·¾¶
var template = require('./atc/lib/template.js');

// js¸ñÊ½»¯¹¤¾ßÂ·¾¶
var js_beautify = require('./atc/lib/beautify.js');





// ²Ù×÷ÏµÍ³Ïà¹ØAPI·â×°
var OS = {
    
    file: {
    
        /** 
         * ÎÄ¼þ¶ÁÈ¡
         * @param    {String}        ÎÄ¼þÂ·¾¶
         * @param    {String}        Ö¸¶¨×Ö·û¼¯
         * @param     {Boolean}         ÊÇ·ñÎª¶þ½øÖÆÊý¾Ý. Ä¬ÈÏfalse
         * @return    {String}         ÎÄ¼þÄÚÈÝ
         */
        read: function (path, charset, isBinary) {
            charset = charset || 'UTF-8';
            var stream = new ActiveXObject('adodb.stream');
            var fileContent;

            stream.type = isBinary ? 1 : 2;
            stream.mode = 3;
            stream.open();
            stream.charset = charset;
            try {
                stream.loadFromFile(path);
            } catch (e) {
                OS.console.log(path);
                throw e;
            }
            fileContent = new String(stream.readText());
            fileContent.charset = charset;
            stream.close();
            return fileContent.toString();
        },


        /**
         * ÎÄ¼þÐ´Èë
         * @param     {String}         ÎÄ¼þÂ·¾¶
         * @param     {String}         ÒªÐ´ÈëµÄÊý¾Ý
         * @param    {String}        Ö¸¶¨×Ö·û¼¯. Ä¬ÈÏ'UTF-8'
         * @param     {Boolean}         ÊÇ·ñÎª¶þ½øÖÆÊý¾Ý. Ä¬ÈÏfalse
         * @return     {Boolean}         ²Ù×÷ÊÇ·ñ³É¹¦
         */
         write: function (path, data, charset, isBinary) {
            var stream = new ActiveXObject('adodb.stream');
            
            stream.type = isBinary ? 1 : 2;

            if (charset) {
                stream.charset = charset;
            } else if (!isBinary) {
                stream.charset = 'UTF-8';
            }
            
            try {
                stream.open();
                if (!isBinary) {
                    stream.writeText(data);
                } else {
                    stream.write(data);
                }
                stream.saveToFile(path, 2);

                return true;
            } catch (e) {
                throw e;
            } finally {
                stream.close();
            }

            return true;
        },

        
        /**
         * Ã¶¾ÙÄ¿Â¼ÖÐËùÓÐÎÄ¼þÃû(°üÀ¨×ÓÄ¿Â¼ÎÄ¼þ)
         * @param    {String}    Ä¿Â¼
         * @return    {Array}        ÎÄ¼þÁÐ±í
         */
        get: (function () {
            var fso = new ActiveXObject('Scripting.FileSystemObject');
            var listall = function (infd) {
            
                var fd = fso.GetFolder(infd + '\\');
                var fe = new Enumerator(fd.files);
                var list = [];
                
                while(!fe.atEnd()) { 
                    list.push(fe.item() + '');
                    fe.moveNext();
                }
                
                var fk = new Enumerator(fd.SubFolders);
                for (; !fk.atEnd(); fk.moveNext()) {
                    list = list.concat(listall(fk.item()));
                }
                
                return list;
            };
            
            return function (path) {
                var list = [];
                try {
                    list = listall(path);
                } catch (e) {
                }
                return list;
            }
        })()
    },
    
    app: {


        /**
         * »ñÈ¡ÍêÕûÂ·¾¶Ãû
         * @return  {String}
         */
        getFullName: function () {
          return WScript.ScriptFullName
        },
    
        /**
         * »ñÈ¡ÔËÐÐ²ÎÊý
         * @return    {Array}            ²ÎÊýÁÐ±í
         */
        getArguments: function () {
            var Arguments = WScript.Arguments;
            var length = Arguments.length;
            var args = [];
            
            if (length) {
                for (var i = 0; i < length; i ++) {
                    args.push(Arguments(i));
                }
            }
            
            return args;
        },
        
        quit: function () {
            WScript.Quit(OS.app.errorlevel);
        },
        
        errorlevel: 0
    },
    
    // ¿ØÖÆÌ¨
    console: {
        error: function (message) {
            OS.app.errorlevel = 1;
            WScript.Echo(message);
        },
        log: function (message) {
            WScript.Echo(message);
        }
    }
};

var Global = this;
var console = OS.console;
var log = console.log;
var error = console.error;

function require (path) {
    this.$dependencies = this.$dependencies || [];
    this.$dependencies.push(path);
}

this.$dependencies = this.$dependencies || [];
for (var i = 0; i < this.$dependencies.length; i ++) {
    Global.eval(OS.file.read(this.$dependencies[i], 'UTF-8'));
}


/*-----*/


if (!Array.prototype.forEach) {
  // ES5 15.4.4.18
  // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/array/foreach
  Array.prototype.forEach = function(fn, context) {
    for (var i = 0, len = this.length >>> 0; i < len; i++) {
      if (i in this) {
        fn.call(context, this[i], i, this);
      }
    }
  }; 
}

if (!String.prototype.trim) {
String.prototype.trim = (function() {

    // http://perfectionkills.com/whitespace-deviations/
    var whiteSpaces = [

      '\\s',
      '00A0', // 'NO-BREAK SPACE'
      '1680', // 'OGHAM SPACE MARK'
      '180E', // 'MONGOLIAN VOWEL SEPARATOR'
      '2000-\\u200A',
      '200B', // 'ZERO WIDTH SPACE (category Cf)
      '2028', // 'LINE SEPARATOR'
      '2029', // 'PARAGRAPH SEPARATOR'
      '202F', // 'NARROW NO-BREAK SPACE'
      '205F', // 'MEDIUM MATHEMATICAL SPACE'
      '3000' //  'IDEOGRAPHIC SPACE'

    ].join('\\u');

    var trimLeftReg = new RegExp('^[' + whiteSpaces + ']+');
    var trimRightReg = new RegExp('[' + whiteSpaces + ']+$');

    return function() {
      return String(this).replace(trimLeftReg, '').replace(trimRightReg, '');
    }

  })();
}



/*!
 * Ä£°å±àÒëÆ÷
 * @param   {String}    Ä£°å
 * @param   {String}    Íâ²¿¸¨Öú·½·¨Â·¾¶£¨Èô²»¶¨ÒåÔò»á°Ñ¸¨Öú·½·¨¸´ÖÆºó±àÒëµ½º¯ÊýÄÚ£©
 * @return  {String}    ±àÒëºÃµÄÄ£°å
 */
var compiler = (function () {

    template.isCompress = true;


    // ÌáÈ¡includeÄ£°å
    // @see https://github.com/seajs/seajs/blob/master/src/util-deps.js
    var REQUIRE_RE = /"(?:\\"|[^"])*"|'(?:\\'|[^'])*'|\/\*[\S\s]*?\*\/|\/(?:\\\/|[^/\r\n])+\/(?=[^\/])|\/\/.*|\.\s*include|(?:^|[^$])\binclude\s*\(\s*(["'])(.+?)\1\s*(,\s*(.+?)\s*)?\)/g; //"
    var SLASH_RE = /\\\\/g

    var parseDependencies = function (code) {
        var ret = [];
        var uniq = {};

        code
        .replace(SLASH_RE, "")
        .replace(REQUIRE_RE, function(m, m1, m2) {
            if (m2 && !uniq.hasOwnProperty(m2)) {
                ret.push(m2);
                uniq[m2] = true;
            }
        });

      return ret
    };


    // °ü×°³ÉRequireJS¡¢SeaJSÄ£¿é
    var toModule = function (code, helpersPath) {

        template.onerror = function (e) {
            throw e;
        };

        var render = template.compile(code); // Ê¹ÓÃartTemplate±àÒëÄ£°å
        

        render = render.toString()
        .replace(/^function\s+(anonymous)/, 'function');


        // SeaJSÓëRequireJS¹æ·¶£¬Ïà¶ÔÂ·¾¶Ç°ÃæÐèÒª´ø¡°.¡±
        var fixPath = function (path) {
            path = path
            .replace(/\\/g, '/')
            .replace(/\.js$/, '');

            if (!/^(\.)*?\//.test(path)) {
                path = './' + path;
            }
            return path;
        };


        var dependencies = [];
        parseDependencies(render).forEach(function (path) {
            dependencies.push(
                '\'' + path + '\': ' + 'require(\'' + fixPath(path) + '\')'
            );
        });
        var isDependencies = dependencies.length;
        dependencies = '{' + dependencies.join(',') + '}';


        // Êä³ö¸¨Öú·½·¨
        var helpers;

        if (helpersPath) {

            helpersPath = fixPath(helpersPath);

            helpers = 'require(\'' + helpersPath + '\')';

        } else {

            helpers = [];
            var prototype = render.prototype;

            for (var name in prototype) {
                if (name !== '$render') {
                    helpers.push(
                        '\'' + name + '\': ' + prototype[name].toString()
                    );
                }
            }
            helpers = '{' + helpers.join(',') + '}';
        }


        code =
        'define(function(require) {'
        +      (isDependencies ? 'var dependencies=' + dependencies + ';' : '')
        +      'var helpers = ' + helpers + ';'
        +      (isDependencies ? 'var $render=function(id,data){'
        +          'return dependencies[id](data);'
        +      '};' : '')
        +      'var Render=' + render  + ';'
        +      'Render.prototype=helpers;'
        +      'return function(data){'
        +          (isDependencies ? 'helpers.$render=$render;' : '')
        +          'return new Render(data) + \'\';'
        +      '}'
        + '});';
        
        
        return code;
    };


    // Íâ²¿JS¸ñÊ½»¯¹¤¾ß
    var format = function(code) {

        if (typeof js_beautify !== 'undefined') {

            js_beautify =
            typeof js_beautify === 'function'
            ? js_beautify
            : js_beautify.js_beautify;

            var config = {
                indent_size: 4,
                indent_char: ' ',
                preserve_newlines: true,
                braces_on_own_line: false,
                keep_array_indentation: false,
                space_after_anon_function: true
            };

            code = js_beautify(code, config);
        }
        return code;
    };

    return function (source, helpersPath) {
        var code = toModule(source, helpersPath);
        return format(code);
    }

})();


// Canonicalize a path
// realpath("http://test.com/a//./b/../c") ==> "http://test.com/a/c"
function realpath (path) {
  var DOT_RE = /\/\.\//g
  var MULTIPLE_SLASH_RE = /([^:\/])\/\/+/g
  var DOUBLE_DOT_RE = /\/[^/]+\/\.\.\//g

  path = path.replace(DOT_RE, "/")

  path = path.replace(MULTIPLE_SLASH_RE, "$1\/")

  while (path.match(DOUBLE_DOT_RE)) {
    path = path.replace(DOUBLE_DOT_RE, "/")
  }

  return path
}

// Ïà¶ÔÂ·¾¶×ª»»Îª¾ø¶ÔÂ·¾¶
if (/^\./.test($path)) {
  $path = realpath((OS.app.getFullName().replace(/[^\/\\]*?$/, '') + $path).replace(/\\/g, '/'));
}


log('$path = ' + $path);
log('-----------------------');




// °Ñ¸¨Öú·½·¨Êä³öÎª¶ÀÁ¢µÄÎÄ¼þ
var writeHelpers = function () {

    if ($cloneHelpers) {
        return;
    }

    var helpersName = '$helpers.js';

    var helpers = [];
    var path = $path + helpersName;
    var prototype = template.prototype;

    for (var name in prototype) {
        if (name !== '$render') {
            helpers.push('\'' + name + '\': ' + prototype[name].toString());
        }
    }
    helpers = '{\r\n' + helpers.join(',\r\n') + '}';

    var module = 'define(function () {'
    +    'return ' + helpers
    + '});'

    if (typeof js_beautify !== 'undefined') {
        var config = {
            indent_size: 4,
            indent_char: ' ',
            preserve_newlines: true,
            braces_on_own_line: false,
            keep_array_indentation: false,
            space_after_anon_function: true
        };
        module = typeof js_beautify === 'function'
        ? js_beautify(module, config)
        : js_beautify.js_beautify(module, config);
    }


    OS.file.write(path, module, $charset);

    return helpersName;
};



var helpersName = writeHelpers();
var args = OS.app.getArguments(); // »ñÈ¡Ê¹ÓÃÍÏ×§·½Ê½´ò¿ªµÄÎÄ¼þÁÐ±í
var list = args.length ? args : OS.file.get($path); // ´ý´¦ÀíµÄÎÄ¼þÁÐ±í


list.forEach(function (path, index) {
    // °ÑÂ·¾¶ "\" ×ª»»³É "/"
    path = list[index] = path.replace(/\\/g, '/');
    
    // ºÏ·¨ÐÔÐ£Ñé
    if (path.indexOf($path) !== 0) {
        error('¾¯¸æ£º' + path + '²»ÔÚÄ£°åÄ¿Â¼ÖÐ£¬¿ÉÄÜµ¼ÖÂÂ·¾¶´íÎó');
    }
});


// ±àÒë¶ÓÁÐÖÐµÄÄ£°å
list.forEach(function (path) {
    var SUFFIX_RE = /\.(html|htm|tpl|inc)$/i;
    if (!SUFFIX_RE.test(path)) {
        return;
    }

    var name = helpersName;
    
    // ¼ÆËã¸¨Öú·½·¨Ä£¿éµÄÏà¶ÔÂ·¾¶
    if (name) {
        var prefix = './';
        var length = path.replace($path, '').replace(/[^\/]/g, '').length;

        if (length) {
          prefix = (new Array(length + 1)).join('../');
        }

        name = prefix + name;
    }

    log('±àÒë: ' + path);

    var source = OS.file.read(path, $charset);
    var code = compiler(source, name);
    var target = path.replace(SUFFIX_RE, '.js');

    OS.file.write(target, code, $charset);

    log('Êä³ö: ' + target);
});

log('-----------------------');
log('½áÊø');

OS.app.quit();

/*-----------------------------------------------*//*
:cmd
::if %errorlevel% == 0 exit
pause>nul
exit
*/





