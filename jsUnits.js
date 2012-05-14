/**
 * @author jeff lutzenberger github.com/JeffLutzenberger
 *
 * @description This library matches and parses various engineering units
 *  English (lb, in, feet)
 *  Metric (meters, Newtons)
 *
 *  Length
 *  Force
 *  Moments
 *  Force/Length
 *  Force/Area
 *
 * */

var jsUnits = (function()
{
    var my = {};
    /**
     * Length
     * */
    // matches 4.4 " or 4.4 inches or 4.4 in
    my.inchesRegEx = new RegExp( /^(\s{0,})(-{0,1})\d*(|\.\d*)(\s{0,1})(\"|in|inch|inches)(\s{0,})$/ );
    my.inchesSplit = new RegExp( /(\"|in|inch|inches)/ );
    // matches 1/4 " or 1/4 inches or 1/4 in
    my.inchFracRegEx = new RegExp( /^(\s{0,})(-{0,1})\d*\/\d*(\s{0,1})(\"|in|inch|inches)(\s{0,})$/ );
    // matches 4.4 ' or 4.4 feet or 4 ft
    my.feetRegEx = new RegExp( /^(\s{0,})(-{0,1})\d*(|\.\d*)(\s{0,1})(\'|ft|feet)(\s{0,})$/ );
    my.feetSplit = new RegExp( /(\'|ft|feet)/ );
    // matches 4' 4" or 4ft 4in or 4feet 4inches
    my.feetInchesRegEx = new RegExp( /^(\s{0,})\d*(\s{0,1})(\'|ft|feet)(\s{0,})\d*((\s{0,})|(\s{0,1})(\"|in|inch|inches)(\s{0,}))$/ );
    // matches 4' 4 1/4" or 4ft 4 1/4in or 4feet 4 1/4inches
    my.feetInchesInchFracRegEx = new RegExp( /^(\s{0,})\d*(\s{0,1})(\'|ft|feet)(\s{0,})\d*(\s{0,1})\d*\/\d*(\s{0,1})(\"|in|inch|inches)(\s{0,})$/ );
    // matches -42 or 42
    my.integerRegEx = new RegExp( /^(\s{0,})(-{0,1})\d*(\s{0,1})$/ );
    // matches -42.0 or 42
    my.decimalRegEx = new RegExp( /^(\s{0,})(-{0,1})\d*(|\.\d*)(\s{0,1})$/ );
    // matches 42 m or 42 meters
    my.meterRegEx = new RegExp( /^(\s{0,})(-{0,1})\d*(|\.\d*)(\s{0,1})(m|meter|meters)(\s{0,})$/ );
    my.metersSplit = new RegExp( /(m|meter|meters)/ );
    // matches 42 cm or 42 centimeters
    my.centimeterRegEx = new RegExp( /^(\s{0,})(-{0,1})\d*(|\.\d*)(\s{0,1})((cm)|(centimeter)|(centimeters))(\s{0,})$/ );
    my.centimetersSplit = new RegExp( /(cm|centimeter|centimeters)/ );
    // matches 42 mm or 42 millimeters
    my.millimeterRegEx = new RegExp( /^(\s{0,})(-{0,1})\d*(|\.\d*)(\s{0,1})(mm|millimeter|millimeters)(\s{0,})$/ );
    my.millimetersSplit = new RegExp( /(mm|millimeter|millimeters)/ );

    my.parseInch = function(s)
    {
        var tokens = s.split(my.inchesSplit);
        if( tokens.length <= 0 || isNaN(tokens[0])){
            throw("Error Parsing Inches: " + s );
            return 0;
        }
        return Number(tokens[0]);
    }

    my.parseInchFraction = function(s)
    {
        var tokens = s.split(my.inchesSplit);
        if( tokens.length > 0 ){
            tokens = tokens[0].split(/\//);
            if( tokens.length > 1 ){
                var numerator = tokens[0];
                var denomenator = my.parseInch(tokens[1]);
                if( !isNaN(numerator) && !isNaN(denomenator) ){
                    return Number(numerator)/Number(denomenator);
                }
            }
        }
        throw("Error Parsing Inch Fraction: " + s );
        return 0;
    }
    
    my.parseFeet = function(s)
    {
        var tokens = s.split(my.feetSplit);
        if( tokens.length <= 0 || isNaN(tokens[0]) ){
            throw("Error Parsing Feet: " + s );
            return 0;
        }   
        return Number(tokens[0]*12);
    }
    
    /**
     * @param {string} s string to parse
     * @param {string} blank_unit if parsing a number with no unit this allows you to specify an assumed unit system
     * */
    my.ParseLength = function( s, blank_unit )
    {
        if(s.match( my.integerRegEx ) || s.match( my.decimalRegEx )){
            if( blank_unit && (blank_unit === "inches" || blank_unit === "in") ){
                return Number(s);
            }
            else
                return Number( s ) * 12;
        }
        if( s.match( my.inchesRegEx ) ){
            return my.parseInch(s);
        }
        if( s.match( my.inchFracRegEx )){
            return my.parseInchFraction(s);
        }
        if( s.match( my.feetRegEx ) ){
            return my.parseFeet(s);
        }
        if( s.match( my.feetInchesRegEx ) ){
            var tokens = s.split(my.feetSplit);
            try{
                var feet = Number(tokens[0]);
                var inches = my.parseInch(tokens[2]); //why is this not 1?
                return feet*12 + inches;
            }catch(er){
                throw("Error Parsing Feet Inches: " + s + " " + er );
                return 0;
            }
        }
        if( s.match( my.feetInchesInchFracRegEx ) ){
            var tokens = s.split(my.feetSplit);
            //for( var index in tokens ) alert(tokens[index]);
            var feet = Number(tokens[0]);
            var tokens = tokens[2].split(" ");
            //for( var index in tokens ) alert(tokens[index]);        
            var inches = Number(tokens[1]);
            var inchFrac = my.parseInchFraction(tokens[2]);
            return feet*12 + inches + inchFrac;
        }
        if( s.match( my.meterRegEx ) ){
            //alert( s );
            var tokens = s.split(my.metersSplit);
            var meters = Number(tokens[0]);
            return meters*39.370078;
        }
        if( s.match( my.centimeterRegEx ) ){
            //alert( s );
            var tokens = s.split(my.centimetersSplit);
            var cm = Number(tokens[0]);
            return cm*0.39370078;
        }
        if( s.match( my.millimeterRegEx ) ){
            //alert( s );
            var tokens = s.split(my.millimetersSplit);
            var mm = Number(tokens[0]);
            return mm*0.039370078;
        }
        return NaN;
    }

    my.showInches = function( num )
    {
        return Math.round(num) + '"';
    }
    
    my.showFeetInches = function( num )
    {
        //assume num is in inches (internal unit)
        var feet = Math.floor(num/12);
        var inches = num - feet*12;
        return feet + "' " + Math.round(inches) + '" ';
    }
    
    my.showFeetInchesCodes = function( num )
    {
        //assume num is in inches (internal unit)
        var feet = Math.floor(num/12);
        var inches = num - feet*12;
        //if( feet == 0 ) return Math.round(inches) + " in ";
        //else if( inches == 0 ) return feet + " ft ";
        //else
        //return feet + " ft " + Math.round(inches) + " in ";
        return feet + "&#39; " + Math.round(inches) + '&#34; ';
    }

    /*
     * Forces
     */
    my.lbsRegEx = new RegExp( /^(\s{0,})(-{0,1})\d*(|\.\d*)(\s{0,1})(lb|lbs|pound|pounds)(\s{0,})$/ );
    my.lbsSplit = new RegExp( /(lb|lbs|pound|pounds)/ );
    // matches 42 k, 42.0 k or 42 kips or 42.0 kips
    my.kipsRegEx = new RegExp( /^(\s{0,})(-{0,1})\d*(|\.\d*)(\s{0,1})(k|kip|kips)(\s{0,})$/ );
    my.kipsSplit = new RegExp( /(k|kip|kips)/ );
    // matches 42 tons, 42.0 ton
    my.tonsRegEx = new RegExp( /^(\s{0,})(-{0,1})\d*(|\.\d*)(\s{0,1})(ton|tons)(\s{0,})$/ );
    my.tonsSplit = new RegExp( /(ton|tons)/ );
    // matches 42 n, 42.0 newton or 42 newtons
    my.newtonsRegEx = new RegExp( /^(\s{0,})(-{0,1})\d*(|\.\d*)(\s{0,1})(n|newton|newtons)(\s{0,})$/ );
    my.newtonsSplit = new RegExp( /(n|newton|newton)/ );
    // matches 42 k, 42.0 k or 42 kips or 42.0 kips
    my.kNRegEx = new RegExp( /^(\s{0,})(-{0,1})\d*(|\.\d*)(\s{0,1})(kn|kns|killonewton|killonewtons)(\s{0,})$/ );
    my.kNSplit = new RegExp( /(kn|killonewton|killonewtons)/ );

    my.parseLbs = function(s)
    {
        var tokens = s.split( my.lbsSplit );
        if( tokens.length <= 0 || isNaN(tokens[0])){
            throw("Error Parsing Lbs: " + s );
            return 0;
        }
        return Number(tokens[0]);
    }

    my.parseKips = function(s)
    {
        var tokens = s.split(my.kipsSplit);
        if( tokens.length <= 0 || isNaN(tokens[0])){
            throw("Error Parsing Kips: " + s );
            return 0;
        }
        return Number(tokens[0])*1000;
    }

    my.parseTons = function(s)
    {
        var tokens = s.split(my.tonsSplit);
        if( tokens.length <= 0 || isNaN(tokens[0])){
            throw("Error Parsing Tons: " + s );
            return 0;
        }
        return Number(tokens[0])*2000;
    }

    my.parseNewtons = function(s)
    {
        var tokens = s.split(my.newtonsSplit);
        if( tokens.length <= 0 || isNaN(tokens[0])){
            throw("Error Parsing Newtons: " + s );
            return 0;
        }
        return Number(tokens[0])* 0.224808943;
    }
    
    my.parseKN = function(s)
    {
        var tokens = s.split(my.kNSplit);
        if( tokens.length <= 0 || isNaN(tokens[0])){
            throw("Error Parsing KN: " + s );
            return 0;
        }
        return Number(tokens[0])* 224.808943;
    }

    /**
     * @param {string} s string to parse
     * @param {string} default_unit if parsing a number with no unit this allows you to specify an assumed unit system
     * */
    my.ParseForce = function( s, default_unit )
    {
        if(s.match( my.integerRegEx ) || s.match( my.decimalRegEx )){
            if( default_unit )
            {
                if( default_unit.match(my.kipsSplit) )
                {
                    return Number(s)*1000;
                }
            }
            return Number(s);
        }
        if( s.match( my.lbsRegEx ) ){
            return my.parseLbs(s);
        }
        if( s.match( my.kipsRegEx )){
            return my.parseKips(s);
        }
        if( s.match( my.tonsRegEx ) ){
            return my.parseTons(s);
        }
        if( s.match( my.newtonsRegEx ) ){
            return my.parseNewtons(s);
        }
        if( s.match( my.kNRegEx ) ){
            return my.parseKN(s);
        }
        return NaN;
    }

    my.showKips = function( num )
    {
        //assume num is in lbs (internal unit)
        var kip_num = Number(num)*0.001;
        return kip_num.toFixed(2);
    }

    /*
     * Moments
     */
    my.lbsInRegEx = new RegExp( /^(\s{0,})(-{0,1})\d*(|\.\d*)(\s{0,1})(lb|lbs|pound|pounds)(-|.|(s\{0,}))(in|inch|inches)(\s{0,})$/ );
    my.lbsInSplit = new RegExp( /(lb|lbs|pound|pounds)(-|.|(s\{0,}))(in|inch|inches)/ );
    my.lbsFtRegEx = new RegExp( /^(\s{0,})(-{0,1})\d*(|\.\d*)(\s{0,1})(lb|lbs|pound|pounds)(-|.|(s\{0,}))(ft|feet|foot)(\s{0,})$/ );
    my.lbsFtSplit = new RegExp( /(lb|lbs|pound|pounds)(-|.|(s\{0,}))(ft|feet|foot)/ );
    my.kipInRegEx = new RegExp( /^(\s{0,})(-{0,1})\d*(|\.\d*)(\s{0,1})(k|kip|kips)(-|.|(s\{0,}))(in|inch|inches)(\s{0,})$/ );
    my.kipInSplit = new RegExp( /(k|kip|kips)(-|.|(s\{0,}))(in|inch|inches)/ );
    my.kipFtRegEx = new RegExp( /^(\s{0,})(-{0,1})\d*(|\.\d*)(\s{0,1})(k|kip|kips)(-|.|(s\{0,}))(ft|feet|foot)(\s{0,})$/ );
    my.kipFtSplit = new RegExp( /(k|kip|kips)(-|.|(s\{0,}))(ft|feet|foot)/ );
    my.nMRegEx = new RegExp( /^(\s{0,})(-{0,1})\d*(|\.\d*)(\s{0,1})(n|newton|newtons)(-|.|(s\{0,}))(m|meter|meters)(\s{0,})$/ );
    my.nMSplit = new RegExp( /(n|newton|newtons)(-|.|(s\{0,}))(m|meter|meters)/ );
    my.kNMRegEx = new RegExp( /^(\s{0,})(-{0,1})\d*(|\.\d*)(\s{0,1})(kn|killonewton|killonewtons)(-|.|(s\{0,}))(m|meter|meters)(\s{0,})$/ );
    my.kNMSplit = new RegExp( /(kn|killonewton|killonewtons)(-|.|(s\{0,}))(m|meter|meters)/ );

    my.parseLbsIn = function(s)
    {
        var tokens = s.split( my.lbsInSplit );
        if( tokens.length <= 0 || isNaN(tokens[0])){
            throw("Error Parsing Lb in: " + s );
            return 0;
        }
        return Number(tokens[0]);
    }

    my.parseLbsFt = function(s)
    {
        var tokens = s.split( my.lbsFtSplit );
        if( tokens.length <= 0 || isNaN(tokens[0])){
            throw("Error Parsing Lb Ft: " + s );
            return 0;
        }
        return Number(tokens[0])*12;
    }

    my.parseKipIn = function(s)
    {
        var tokens = s.split(my.kipInSplit);
        if( tokens.length <= 0 || isNaN(tokens[0])){
            throw("Error Parsing Kip In: " + s );
            return 0;
        }
        return Number(tokens[0])*1000;
    }

    my.parseKipFt = function(s)
    {
        var tokens = s.split(my.kipFtSplit);
        if( tokens.length <= 0 || isNaN(tokens[0])){
            throw("Error Parsing Kip Ft: " + s );
            return 0;
        }
        return Number(tokens[0])*1000*12;
    }

    my.parseNM = function(s)
    {
        var tokens = s.split(my.nMSplit);
        if( tokens.length <= 0 || isNaN(tokens[0])){
            throw("Error Parsing N M: " + s );
            return 0;
        }
        return Number(tokens[0])*39.370078* 0.224808943;
    }

    my.parsekNM = function(s)
    {
        var tokens = s.split(my.kNMSplit);
        if( tokens.length <= 0 || isNaN(tokens[0])){
            throw("Error Parsing KN M: " + s );
            return 0;
        }
        return Number(tokens[0])*1000*39.370078* 0.224808943;
    }

    my.ParseMoment = function( s, default_unit )
    {
        if(s.match( my.integerRegEx ) || s.match( my.decimalRegEx )){
            if( default_unit )
            {
                if( default_unit.match(my.kipFtSplit) )
                {
                    return Number(s)*1000*12;
                }
            }
            return Number(s);
        }
        if( s.match( my.lbsInRegEx ) ){
            return my.parseLbsIn(s);
        }
        if( s.match( my.lbsFtRegEx ) ){
            return my.parseLbsFt(s);
        }
        if( s.match( my.kipInRegEx )){
            return my.parseKipIn(s);
        }
        if( s.match( my.kipFtRegEx ) ){
            return my.parseKipFt(s);
        }
        if( s.match( my.nMRegEx ) ){
            return my.parseNM(s);
        }
        if( s.match( my.kNMRegEx ) ){
            return my.parsekNM(s);
        }
        return NaN;
    }

    my.showKipFt = function( num )
    {
        //assume num is in lbs-in (internal unit)
        return Number(Number(num)/1000/12).toFixed(2);
    }

    /*
     * Forces per unit length
     */
    my.lbsPerInRegEx = new RegExp( /^(\s{0,})(-{0,1})\d*(|\.\d*)(\s{0,1})(lb|lbs|pound|pounds)(\s{0,1})\/(\s{0,1})(in|inch|inches)(\s{0,})$/ );
    my.lbsPerInSplit = new RegExp( /(lb|lbs|pound|pounds)(\s{0,1})\/(\s{0,1})(in|inch|inches)/ );
    my.lbsPerFtRegEx = new RegExp( /^(\s{0,})(-{0,1})\d*(|\.\d*)(\s{0,1})(lb|lbs|pound|pounds)(\s{0,1})\/(\s{0,1})(ft|feet|foot)(\s{0,})$/ );
    my.lbsPerFtSplit = new RegExp( /(lb|lbs|pound|pounds)(\s{0,1})\/(\s{0,1})(ft|feet|foot)/ );
    my.kipPerInRegEx = new RegExp( /^(\s{0,})(-{0,1})\d*(|\.\d*)(\s{0,1})(k|kip|kips)(\s{0,1})\/(\s{0,1})(in|inch|inches)(\s{0,})$/ );
    my.kipPerInSplit = new RegExp( /(k|kip|kips)(\s{0,1})\/(\s{0,1})(in|inch|inches)/ );
    my.kipPerFtRegEx = new RegExp( /^(\s{0,})(-{0,1})\d*(|\.\d*)(\s{0,1})(k|kip|kips)(\s{0,1})\/(\s{0,1})(ft|feet|foot)(\s{0,})$/ );
    my.kipPerFtSplit = new RegExp( /(k|kip|kips)(\s{0,1})\/(\s{0,1})(ft|feet|foot)/ );
    my.nPerMRegEx = new RegExp( /^(\s{0,})(-{0,1})\d*(|\.\d*)(\s{0,1})(n|newton|newtons)(\s{0,1})\/(\s{0,1})(m|meter|meters)(\s{0,})$/ );
    my.nPerMSplit = new RegExp( /(n|newton|newtons)(\s{0,1})\/(\s{0,1})(m|meter|meters)/ );
    my.kNPerMRegEx = new RegExp( /^(\s{0,})(-{0,1})\d*(|\.\d*)(\s{0,1})(kn|killonewton|killonewtons)(\s{0,1})\/(\s{0,1})(m|meter|meters)(\s{0,})$/ );
    my.kNPerMSplit = new RegExp( /(kn|killonewton|killonewtons)(\s{0,1})\/(\s{0,1})(m|meter|meters)/ );

    my.parseLbsPerIn = function(s)
    {
        var tokens = s.split( my.lbsPerInSplit );
        if( tokens.length <= 0 || isNaN(tokens[0])){
            throw("Error Parsing Lb/in: " + s );
            return 0;
        }
        return Number(tokens[0]);
    }

    my.parseLbsPerFt = function(s)
    {
        var tokens = s.split( my.lbsPerFtSplit );
        if( tokens.length <= 0 || isNaN(tokens[0])){
            throw("Error Parsing Lb/Ft: " + s );
            return 0;
        }
        return Number(tokens[0])/12;
    }

    my.parseKipPerIn = function(s)
    {
        var tokens = s.split(my.kipPerInSplit);
        if( tokens.length <= 0 || isNaN(tokens[0])){
            throw("Error Parsing Kip/In: " + s );
            return 0;
        }
        return Number(tokens[0])*1000;
    }

    my.parseKipPerFt = function(s)
    {
        var tokens = s.split(my.kipPerFtSplit);
        if( tokens.length <= 0 || isNaN(tokens[0])){
            throw("Error Parsing Kip/Ft: " + s );
            return 0;
        }
        return Number(tokens[0])*1000/12;
    }

    my.parseNPerM = function(s)
    {
        var tokens = s.split(my.nPerMSplit);
        if( tokens.length <= 0 || isNaN(tokens[0])){
            throw("Error Parsing N/M: " + s );
            return 0;
        }
        return Number(tokens[0])*39.370078/0.224808943;
    }

    my.parsekNPerM = function(s)
    {
        var tokens = s.split(my.kNPerMSplit);
        if( tokens.length <= 0 || isNaN(tokens[0])){
            throw("Error Parsing KN/M: " + s );
            return 0;
        }
        return Number(tokens[0])*1000*39.370078/0.224808943;
    }

    my.ParseForcePerLength = function( s, default_unit )
    {
        if(s.match( my.integerRegEx ) || s.match( my.decimalRegEx )){
            if( default_unit )
            {
                if( default_unit.match(my.kipPerFtSplit) )
                {
                    return Number(s)*1000/12;
                }
            }
            return Number(s);
        }
        if( s.match( my.lbsPerInRegEx ) ){
            return my.parseLbsPerIn(s);
        }
        if( s.match( my.lbsPerFtRegEx ) ){
            return my.parseLbsPerFt(s);
        }
        if( s.match( my.kipPerInRegEx )){
            return my.parseKipPerIn(s);
        }
        if( s.match( my.kipPerFtRegEx ) ){
            return my.parseKipPerFt(s);
        }
        if( s.match( my.nPerMRegEx ) ){
            return my.parseNPerM(s);
        }
        if( s.match( my.kNPerMRegEx ) ){
            return my.parsekNPerM(s);
        }
        return NaN;
    }

    my.showKipsPerFt = function( num )
    {
        //assume num is in lbs-in (internal unit)
        return (Number(num)/1000*12).toFixed(2);
    }

    /*
     * Forces per unit area
     */
    my.lbsPerInInRegEx = new RegExp( /^(\s{0,})(-{0,1})\d*(|\.\d*)(\s{0,1})(lb|lbs|pound|pounds)(\s{0,1})\/(\s{0,1})(in\^2|inch\^2)(\s{0,})$/ );
    my.lbsPerInInSplit = new RegExp( /(lb|lbs|pound|pounds)(\s{0,1})\/(\s{0,1})(in\^2|inch^2)/ );
    my.kipPerInInRegEx = new RegExp( /^(\s{0,})(-{0,1})\d*(|\.\d*)(\s{0,1})(k|kip|kips)(\s{0,1})\/(\s{0,1})(in\^2|inch^2)(\s{0,})$/ );
    my.kipPerInInSplit = new RegExp( /(k|kip|kips)(\s{0,1})\/(\s{0,1})(in^2|inch\^2)/ );
    my.ksiRegEx = new RegExp( /^(\s{0,})(-{0,1})\d*(|\.\d*)(\s{0,1})(ksi)$/ );
    my.ksiSplit = new RegExp( /(ksi)/ );

    my.parseLbsPerInIn = function(s)
    {
        var tokens = s.split( my.lbsPerInInSplit );
        if( tokens.length <= 0 || isNaN(tokens[0])){
            throw("Error Parsing Lb/in^2: " + s );
            return 0;
        }
        return Number(tokens[0]);
    }

    my.parseKipPerInIn = function(s)
    {
        var tokens = s.split(my.kipPerInInSplit);
        if( tokens.length <= 0 || isNaN(tokens[0])){
            throw("Error Parsing Kip/In^2: " + s );
            return 0;
        }
        return Number(tokens[0])*1000;
    }

    my.parseKsi = function(s)
    {
        var tokens = s.split(my.ksiSplit);
        if( tokens.length <= 0 || isNaN(tokens[0])){
            throw("Error Parsing ksi: " + s );
            return 0;
        }
        return Number(tokens[0])*1000;
    }

    my.ParseForcePerArea = function( s, default_unit )
    {
        if(s.match( my.integerRegEx ) || s.match( my.decimalRegEx )){
            if( default_unit )
            {
                if( default_unit.match(my.kipPerInInSplit) || default_unit.match(my.ksiSplit))
                {
                    return Number(s)*1000;
                }
            }
            return Number(s);
        }
        if( s.match( my.lbsPerInInRegEx ) ){
            return my.parseLbsPerInIn(s);
        }
        if( s.match( my.kipPerInInRegEx )){
            return my.parseKipPerInIn(s);
        }
        if( s.match( my.ksiRegEx ) ){
            return my.parseKsi(s);
        }
        return NaN;
    }

    my.showKsi = function( num )
    {
        //assume num is in lbs/in-in (internal unit)
        return (Number(num)/1000).toFixed(2) + " ksi";
    }
    
    return my;

}());

