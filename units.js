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

var jsUnits = function()
{
    /**
     * Length
     * */
    // matches 4.4 " or 4.4 inches or 4.4 in
    this.inchesRegEx = new RegExp( /^(\s{0,})(-{0,1})\d*(|\.\d*)(\s{0,1})(\"|in|inch|inches)(\s{0,})$/ );
    this.inchesSplit = new RegExp( /(\"|in|inch|inches)/ );
    // matches 1/4 " or 1/4 inches or 1/4 in
    this.inchFracRegEx = new RegExp( /^(\s{0,})(-{0,1})\d*\/\d*(\s{0,1})(\"|in|inch|inches)(\s{0,})$/ );
    // matches 4.4 ' or 4.4 feet or 4 ft
    this.feetRegEx = new RegExp( /^(\s{0,})(-{0,1})\d*(|\.\d*)(\s{0,1})(\'|ft|feet)(\s{0,})$/ );
    this.feetSplit = new RegExp( /(\'|ft|feet)/ );
    // matches 4' 4" or 4ft 4in or 4feet 4inches
    this.feetInchesRegEx = new RegExp( /^(\s{0,})\d*(\s{0,1})(\'|ft|feet)(\s{0,})\d*((\s{0,})|(\s{0,1})(\"|in|inch|inches)(\s{0,}))$/ );
    // matches 4' 4 1/4" or 4ft 4 1/4in or 4feet 4 1/4inches
    this.feetInchesInchFracRegEx = new RegExp( /^(\s{0,})\d*(\s{0,1})(\'|ft|feet)(\s{0,})\d*(\s{0,1})\d*\/\d*(\s{0,1})(\"|in|inch|inches)(\s{0,})$/ );
    // matches -42 or 42
    this.integerRegEx = new RegExp( /^(\s{0,})(-{0,1})\d*(\s{0,1})$/ );
    // matches -42.0 or 42
    this.decimalRegEx = new RegExp( /^(\s{0,})(-{0,1})\d*(|\.\d*)(\s{0,1})$/ );
    // matches 42 m or 42 meters
    this.meterRegEx = new RegExp( /^(\s{0,})(-{0,1})\d*(|\.\d*)(\s{0,1})(m|meter|meters)(\s{0,})$/ );
    this.metersSplit = new RegExp( /(m|meter|meters)/ );
    // matches 42 cm or 42 centimeters
    this.centimeterRegEx = new RegExp( /^(\s{0,})(-{0,1})\d*(|\.\d*)(\s{0,1})((cm)|(centimeter)|(centimeters))(\s{0,})$/ );
    this.centimetersSplit = new RegExp( /(cm|centimeter|centimeters)/ );
    // matches 42 mm or 42 millimeters
    this.millimeterRegEx = new RegExp( /^(\s{0,})(-{0,1})\d*(|\.\d*)(\s{0,1})(mm|millimeter|millimeters)(\s{0,})$/ );
    this.millimetersSplit = new RegExp( /(mm|millimeter|millimeters)/ );

    this.parseInch = function(s)
    {
        var tokens = s.split(this.inchesSplit);
        if( tokens.length <= 0 || isNaN(tokens[0])){
            throw("Error Parsing Inches: " + s );
            return 0;
        }
        return Number(tokens[0]);
    }

    this.parseInchFraction = function(s)
    {
        var tokens = s.split(this.inchesSplit);
        if( tokens.length > 0 ){
            tokens = tokens[0].split(/\//);
            if( tokens.length > 1 ){
                var numerator = tokens[0];
                var denomenator = this.parseInch(tokens[1]);
                if( !isNaN(numerator) && !isNaN(denomenator) ){
                    return Number(numerator)/Number(denomenator);
                }
            }
        }
        throw("Error Parsing Inch Fraction: " + s );
        return 0;
    }
    
    this.parseFeet = function(s)
    {
        var tokens = s.split(this.feetSplit);
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
    this.ParseLength = function( s, blank_unit )
    {
        if(s.match( this.integerRegEx ) || s.match( this.decimalRegEx )){
            if( blank_unit && (blank_unit === "inches" || blank_unit === "in") ){
                return Number(s);
            }
            else
                return Number( s ) * 12;
        }
        if( s.match( this.inchesRegEx ) ){
            return this.parseInch(s);
        }
        if( s.match( this.inchFracRegEx )){
            return this.parseInchFraction(s);
        }
        if( s.match( this.feetRegEx ) ){
            return this.parseFeet(s);
        }
        if( s.match( this.feetInchesRegEx ) ){
            var tokens = s.split(this.feetSplit);
            try{
                var feet = Number(tokens[0]);
                var inches = this.parseInch(tokens[2]); //why is this not 1?
                return feet*12 + inches;
            }catch(er){
                throw("Error Parsing Feet Inches: " + s + " " + er );
                return 0;
            }
        }
        if( s.match( this.feetInchesInchFracRegEx ) ){
            var tokens = s.split(this.feetSplit);
            //for( var index in tokens ) alert(tokens[index]);
            var feet = Number(tokens[0]);
            var tokens = tokens[2].split(" ");
            //for( var index in tokens ) alert(tokens[index]);        
            var inches = Number(tokens[1]);
            var inchFrac = this.parseInchFraction(tokens[2]);
            return feet*12 + inches + inchFrac;
        }
        if( s.match( this.meterRegEx ) ){
            //alert( s );
            var tokens = s.split(this.metersSplit);
            var meters = Number(tokens[0]);
            return meters*39.370078;
        }
        if( s.match( this.centimeterRegEx ) ){
            //alert( s );
            var tokens = s.split(this.centimetersSplit);
            var cm = Number(tokens[0]);
            return cm*0.39370078;
        }
        if( s.match( this.millimeterRegEx ) ){
            //alert( s );
            var tokens = s.split(this.millimetersSplit);
            var mm = Number(tokens[0]);
            return mm*0.039370078;
        }
        return NaN;
    }

    this.showInches = function( num )
    {
        return Math.round(num) + '"';
    }
    
    this.showFeetInches = function( num )
    {
        //assume num is in inches (internal unit)
        var feet = Math.floor(num/12);
        var inches = num - feet*12;
        return feet + "' " + Math.round(inches) + '" ';
    }
    
    this.showFeetInchesCodes = function( num )
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
    this.lbsRegEx = new RegExp( /^(\s{0,})(-{0,1})\d*(|\.\d*)(\s{0,1})(lb|lbs|pound|pounds)(\s{0,})$/ );
    this.lbsSplit = new RegExp( /(lb|lbs|pound|pounds)/ );
    // matches 42 k, 42.0 k or 42 kips or 42.0 kips
    this.kipsRegEx = new RegExp( /^(\s{0,})(-{0,1})\d*(|\.\d*)(\s{0,1})(k|kip|kips)(\s{0,})$/ );
    this.kipsSplit = new RegExp( /(k|kip|kips)/ );
    // matches 42 tons, 42.0 ton
    this.tonsRegEx = new RegExp( /^(\s{0,})(-{0,1})\d*(|\.\d*)(\s{0,1})(ton|tons)(\s{0,})$/ );
    this.tonsSplit = new RegExp( /(ton|tons)/ );
    // matches 42 n, 42.0 newton or 42 newtons
    this.newtonsRegEx = new RegExp( /^(\s{0,})(-{0,1})\d*(|\.\d*)(\s{0,1})(n|newton|newtons)(\s{0,})$/ );
    this.newtonsSplit = new RegExp( /(n|newton|newton)/ );
    // matches 42 k, 42.0 k or 42 kips or 42.0 kips
    this.kNRegEx = new RegExp( /^(\s{0,})(-{0,1})\d*(|\.\d*)(\s{0,1})(kn|kns|killonewton|killonewtons)(\s{0,})$/ );
    this.kNSplit = new RegExp( /(kn|killonewton|killonewtons)/ );

    this.parseLbs = function(s)
    {
        var tokens = s.split( this.lbsSplit );
        if( tokens.length <= 0 || isNaN(tokens[0])){
            throw("Error Parsing Lbs: " + s );
            return 0;
        }
        return Number(tokens[0]);
    }

    this.parseKips = function(s)
    {
        var tokens = s.split(this.kipsSplit);
        if( tokens.length <= 0 || isNaN(tokens[0])){
            throw("Error Parsing Kips: " + s );
            return 0;
        }
        return Number(tokens[0])*1000;
    }

    this.parseTons = function(s)
    {
        var tokens = s.split(this.tonsSplit);
        if( tokens.length <= 0 || isNaN(tokens[0])){
            throw("Error Parsing Tons: " + s );
            return 0;
        }
        return Number(tokens[0])*2000;
    }

    this.parseNewtons = function(s)
    {
        var tokens = s.split(this.newtonsSplit);
        if( tokens.length <= 0 || isNaN(tokens[0])){
            throw("Error Parsing Newtons: " + s );
            return 0;
        }
        return Number(tokens[0])* 0.224808943;
    }
    
    this.parseKN = function(s)
    {
        var tokens = s.split(this.kNSplit);
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
    this.ParseForce = function( s, default_unit )
    {
        if(s.match( this.integerRegEx ) || s.match( this.decimalRegEx )){
            if( default_unit )
            {
                if( default_unit.match(this.kipsSplit) )
                {
                    return Number(s)*1000;
                }
            }
            return Number(s);
        }
        if( s.match( this.lbsRegEx ) ){
            return this.parseLbs(s);
        }
        if( s.match( this.kipsRegEx )){
            return this.parseKips(s);
        }
        if( s.match( this.tonsRegEx ) ){
            return this.parseTons(s);
        }
        if( s.match( this.newtonsRegEx ) ){
            return this.parseNewtons(s);
        }
        if( s.match( this.kNRegEx ) ){
            return this.parseKN(s);
        }
        return NaN;
    }

    this.showKips = function( num )
    {
        //assume num is in lbs (internal unit)
        var kip_num = Number(num)*0.001;
        return kip_num.toFixed(2);
    }

    /*
     * Moments
     */
    this.lbsInRegEx = new RegExp( /^(\s{0,})(-{0,1})\d*(|\.\d*)(\s{0,1})(lb|lbs|pound|pounds)(-|.|(s\{0,}))(in|inch|inches)(\s{0,})$/ );
    this.lbsInSplit = new RegExp( /(lb|lbs|pound|pounds)(-|.|(s\{0,}))(in|inch|inches)/ );
    this.lbsFtRegEx = new RegExp( /^(\s{0,})(-{0,1})\d*(|\.\d*)(\s{0,1})(lb|lbs|pound|pounds)(-|.|(s\{0,}))(ft|feet|foot)(\s{0,})$/ );
    this.lbsFtSplit = new RegExp( /(lb|lbs|pound|pounds)(-|.|(s\{0,}))(ft|feet|foot)/ );
    this.kipInRegEx = new RegExp( /^(\s{0,})(-{0,1})\d*(|\.\d*)(\s{0,1})(k|kip|kips)(-|.|(s\{0,}))(in|inch|inches)(\s{0,})$/ );
    this.kipInSplit = new RegExp( /(k|kip|kips)(-|.|(s\{0,}))(in|inch|inches)/ );
    this.kipFtRegEx = new RegExp( /^(\s{0,})(-{0,1})\d*(|\.\d*)(\s{0,1})(k|kip|kips)(-|.|(s\{0,}))(ft|feet|foot)(\s{0,})$/ );
    this.kipFtSplit = new RegExp( /(k|kip|kips)(-|.|(s\{0,}))(ft|feet|foot)/ );
    this.nMRegEx = new RegExp( /^(\s{0,})(-{0,1})\d*(|\.\d*)(\s{0,1})(n|newton|newtons)(-|.|(s\{0,}))(m|meter|meters)(\s{0,})$/ );
    this.nMSplit = new RegExp( /(n|newton|newtons)(-|.|(s\{0,}))(m|meter|meters)/ );
    this.kNMRegEx = new RegExp( /^(\s{0,})(-{0,1})\d*(|\.\d*)(\s{0,1})(kn|killonewton|killonewtons)(-|.|(s\{0,}))(m|meter|meters)(\s{0,})$/ );
    this.kNMSplit = new RegExp( /(kn|killonewton|killonewtons)(-|.|(s\{0,}))(m|meter|meters)/ );

    this.parseLbsIn = function(s)
    {
        var tokens = s.split( this.lbsInSplit );
        if( tokens.length <= 0 || isNaN(tokens[0])){
            throw("Error Parsing Lb in: " + s );
            return 0;
        }
        return Number(tokens[0]);
    }

    this.parseLbsFt = function(s)
    {
        var tokens = s.split( this.lbsFtSplit );
        if( tokens.length <= 0 || isNaN(tokens[0])){
            throw("Error Parsing Lb Ft: " + s );
            return 0;
        }
        return Number(tokens[0])*12;
    }

    this.parseKipIn = function(s)
    {
        var tokens = s.split(this.kipInSplit);
        if( tokens.length <= 0 || isNaN(tokens[0])){
            throw("Error Parsing Kip In: " + s );
            return 0;
        }
        return Number(tokens[0])*1000;
    }

    this.parseKipFt = function(s)
    {
        var tokens = s.split(this.kipFtSplit);
        if( tokens.length <= 0 || isNaN(tokens[0])){
            throw("Error Parsing Kip Ft: " + s );
            return 0;
        }
        return Number(tokens[0])*1000*12;
    }

    this.parseNM = function(s)
    {
        var tokens = s.split(this.nMSplit);
        if( tokens.length <= 0 || isNaN(tokens[0])){
            throw("Error Parsing N M: " + s );
            return 0;
        }
        return Number(tokens[0])*39.370078* 0.224808943;
    }

    this.parsekNM = function(s)
    {
        var tokens = s.split(this.kNMSplit);
        if( tokens.length <= 0 || isNaN(tokens[0])){
            throw("Error Parsing KN M: " + s );
            return 0;
        }
        return Number(tokens[0])*1000*39.370078* 0.224808943;
    }

    this.ParseMoment = function( s, default_unit )
    {
        if(s.match( this.integerRegEx ) || s.match( this.decimalRegEx )){
            if( default_unit )
            {
                if( default_unit.match(this.kipFtSplit) )
                {
                    return Number(s)*1000*12;
                }
            }
            return Number(s);
        }
        if( s.match( this.lbsInRegEx ) ){
            return this.parseLbsIn(s);
        }
        if( s.match( this.lbsFtRegEx ) ){
            return this.parseLbsFt(s);
        }
        if( s.match( this.kipInRegEx )){
            return this.parseKipIn(s);
        }
        if( s.match( this.kipFtRegEx ) ){
            return this.parseKipFt(s);
        }
        if( s.match( this.nMRegEx ) ){
            return this.parseNM(s);
        }
        if( s.match( this.kNMRegEx ) ){
            return this.parsekNM(s);
        }
        return NaN;
    }

    this.showKipFt = function( num )
    {
        //assume num is in lbs-in (internal unit)
        return Number(Number(num)/1000/12).toFixed(2);
    }

    /*
     * Forces per unit length
     */
    this.lbsPerInRegEx = new RegExp( /^(\s{0,})(-{0,1})\d*(|\.\d*)(\s{0,1})(lb|lbs|pound|pounds)(\s{0,1})\/(\s{0,1})(in|inch|inches)(\s{0,})$/ );
    this.lbsPerInSplit = new RegExp( /(lb|lbs|pound|pounds)(\s{0,1})\/(\s{0,1})(in|inch|inches)/ );
    this.lbsPerFtRegEx = new RegExp( /^(\s{0,})(-{0,1})\d*(|\.\d*)(\s{0,1})(lb|lbs|pound|pounds)(\s{0,1})\/(\s{0,1})(ft|feet|foot)(\s{0,})$/ );
    this.lbsPerFtSplit = new RegExp( /(lb|lbs|pound|pounds)(\s{0,1})\/(\s{0,1})(ft|feet|foot)/ );
    this.kipPerInRegEx = new RegExp( /^(\s{0,})(-{0,1})\d*(|\.\d*)(\s{0,1})(k|kip|kips)(\s{0,1})\/(\s{0,1})(in|inch|inches)(\s{0,})$/ );
    this.kipPerInSplit = new RegExp( /(k|kip|kips)(\s{0,1})\/(\s{0,1})(in|inch|inches)/ );
    this.kipPerFtRegEx = new RegExp( /^(\s{0,})(-{0,1})\d*(|\.\d*)(\s{0,1})(k|kip|kips)(\s{0,1})\/(\s{0,1})(ft|feet|foot)(\s{0,})$/ );
    this.kipPerFtSplit = new RegExp( /(k|kip|kips)(\s{0,1})\/(\s{0,1})(ft|feet|foot)/ );
    this.nPerMRegEx = new RegExp( /^(\s{0,})(-{0,1})\d*(|\.\d*)(\s{0,1})(n|newton|newtons)(\s{0,1})\/(\s{0,1})(m|meter|meters)(\s{0,})$/ );
    this.nPerMSplit = new RegExp( /(n|newton|newtons)(\s{0,1})\/(\s{0,1})(m|meter|meters)/ );
    this.kNPerMRegEx = new RegExp( /^(\s{0,})(-{0,1})\d*(|\.\d*)(\s{0,1})(kn|killonewton|killonewtons)(\s{0,1})\/(\s{0,1})(m|meter|meters)(\s{0,})$/ );
    this.kNPerMSplit = new RegExp( /(kn|killonewton|killonewtons)(\s{0,1})\/(\s{0,1})(m|meter|meters)/ );

    this.parseLbsPerIn = function(s)
    {
        var tokens = s.split( this.lbsPerInSplit );
        if( tokens.length <= 0 || isNaN(tokens[0])){
            throw("Error Parsing Lb/in: " + s );
            return 0;
        }
        return Number(tokens[0]);
    }

    this.parseLbsPerFt = function(s)
    {
        var tokens = s.split( this.lbsPerFtSplit );
        if( tokens.length <= 0 || isNaN(tokens[0])){
            throw("Error Parsing Lb/Ft: " + s );
            return 0;
        }
        return Number(tokens[0])/12;
    }

    this.parseKipPerIn = function(s)
    {
        var tokens = s.split(this.kipPerInSplit);
        if( tokens.length <= 0 || isNaN(tokens[0])){
            throw("Error Parsing Kip/In: " + s );
            return 0;
        }
        return Number(tokens[0])*1000;
    }

    this.parseKipPerFt = function(s)
    {
        var tokens = s.split(this.kipPerFtSplit);
        if( tokens.length <= 0 || isNaN(tokens[0])){
            throw("Error Parsing Kip/Ft: " + s );
            return 0;
        }
        return Number(tokens[0])*1000/12;
    }

    this.parseNPerM = function(s)
    {
        var tokens = s.split(this.nPerMSplit);
        if( tokens.length <= 0 || isNaN(tokens[0])){
            throw("Error Parsing N/M: " + s );
            return 0;
        }
        return Number(tokens[0])*39.370078/0.224808943;
    }

    this.parsekNPerM = function(s)
    {
        var tokens = s.split(this.kNPerMSplit);
        if( tokens.length <= 0 || isNaN(tokens[0])){
            throw("Error Parsing KN/M: " + s );
            return 0;
        }
        return Number(tokens[0])*1000*39.370078/0.224808943;
    }

    this.ParseForcePerLength = function( s, default_unit )
    {
        if(s.match( this.integerRegEx ) || s.match( this.decimalRegEx )){
            if( default_unit )
            {
                if( default_unit.match(this.kipPerFtSplit) )
                {
                    return Number(s)*1000/12;
                }
            }
            return Number(s);
        }
        if( s.match( this.lbsPerInRegEx ) ){
            return this.parseLbsPerIn(s);
        }
        if( s.match( this.lbsPerFtRegEx ) ){
            return this.parseLbsPerFt(s);
        }
        if( s.match( this.kipPerInRegEx )){
            return this.parseKipPerIn(s);
        }
        if( s.match( this.kipPerFtRegEx ) ){
            return this.parseKipPerFt(s);
        }
        if( s.match( this.nPerMRegEx ) ){
            return this.parseNPerM(s);
        }
        if( s.match( this.kNPerMRegEx ) ){
            return this.parsekNPerM(s);
        }
        return NaN;
    }

    this.showKipsPerFt = function( num )
    {
        //assume num is in lbs-in (internal unit)
        return (Number(num)/1000*12).toFixed(2);
    }

    /*
     * Forces per unit area
     */
    this.lbsPerInInRegEx = new RegExp( /^(\s{0,})(-{0,1})\d*(|\.\d*)(\s{0,1})(lb|lbs|pound|pounds)(\s{0,1})\/(\s{0,1})(in\^2|inch\^2)(\s{0,})$/ );
    this.lbsPerInInSplit = new RegExp( /(lb|lbs|pound|pounds)(\s{0,1})\/(\s{0,1})(in\^2|inch^2)/ );
    this.kipPerInInRegEx = new RegExp( /^(\s{0,})(-{0,1})\d*(|\.\d*)(\s{0,1})(k|kip|kips)(\s{0,1})\/(\s{0,1})(in\^2|inch^2)(\s{0,})$/ );
    this.kipPerInInSplit = new RegExp( /(k|kip|kips)(\s{0,1})\/(\s{0,1})(in^2|inch\^2)/ );
    this.ksiRegEx = new RegExp( /^(\s{0,})(-{0,1})\d*(|\.\d*)(\s{0,1})(ksi)$/ );
    this.ksiSplit = new RegExp( /(ksi)/ );

    this.parseLbsPerInIn = function(s)
    {
        var tokens = s.split( this.lbsPerInInSplit );
        if( tokens.length <= 0 || isNaN(tokens[0])){
            throw("Error Parsing Lb/in^2: " + s );
            return 0;
        }
        return Number(tokens[0]);
    }

    this.parseKipPerInIn = function(s)
    {
        var tokens = s.split(this.kipPerInInSplit);
        if( tokens.length <= 0 || isNaN(tokens[0])){
            throw("Error Parsing Kip/In^2: " + s );
            return 0;
        }
        return Number(tokens[0])*1000;
    }

    this.parseKsi = function(s)
    {
        var tokens = s.split(this.ksiSplit);
        if( tokens.length <= 0 || isNaN(tokens[0])){
            throw("Error Parsing ksi: " + s );
            return 0;
        }
        return Number(tokens[0])*1000;
    }

    this.ParseForcePerArea = function( s, default_unit )
    {
        if(s.match( this.integerRegEx ) || s.match( this.decimalRegEx )){
            if( default_unit )
            {
                if( default_unit.match(this.kipPerInInSplit) || default_unit.match(this.ksiSplit))
                {
                    return Number(s)*1000;
                }
            }
            return Number(s);
        }
        if( s.match( this.lbsPerInInRegEx ) ){
            return this.parseLbsPerInIn(s);
        }
        if( s.match( this.kipPerInInRegEx )){
            return this.parseKipPerInIn(s);
        }
        if( s.match( this.ksiRegEx ) ){
            return this.parseKsi(s);
        }
        return NaN;
    }

    this.showKsi = function( num )
    {
        //assume num is in lbs/in-in (internal unit)
        return (Number(num)/1000).toFixed(2) + " ksi";
    }
}

