/*
 * ===== Unit System Unit Tests =====
 */ 
//matches 4.4 " or 4.4 inches or 4.4 in
var Units = new jsUnits();

function matchInchesOnly(s)
{ 
    var bValid = s.match( Units.inchesRegEx );
    return bValid;
}

//matches 1/4 " or 1/4 inches or 1/4 in
function matchInchFractionOnly(s)
{
    var bValid = s.match( Units.inchFracRegEx );
    return bValid;
}

// matches 4.4 ' or 4.4 feet or 4 ft
function matchFeetOnly(s)
{
    var bValid = s.match( Units.feetRegEx );
    return bValid;
}

//matches 4' 4" or 4ft 4in or 4feet 4inches
function matchFeetInches(s)
{
    var bValid = s.match( Units.feetInchesRegEx );
    return bValid;
}

//matches 4' 4 1/4" or 4ft 4 1/4in or 4feet 4 1/4inches
function matchFeetInchesInchFraction(s)
{
    var bValid = s.match( Units.feetInchesInchFracRegEx );
    return bValid;
}

function matchInteger(s)
{
    var bValid = s.match( Units.integerRegEx );
}

function matchDecimal(s)
{
    var bValid = s.match( Units.decimalRegEx );
}

function matchMeterOnly(s)
{
    var bValid = s.match( Units.meterRegEx );
    return bValid;
}

function matchCentimeterOnly(s)
{
    var bValid = s.match( Units.centimeterRegEx );
    return bValid;
}

function matchMillimeterOnly(s)
{
    var bValid = s.match( Units.millimeterRegEx );
    return bValid;
}

function testMatchFeetOnly()
{
    function test(s) { return "<p>"+s+": " + (matchFeetOnly(s) ? "YES" : "NO"); }
    var htmlStr = $("#log-console").html();
    htmlStr += "<h2>Match Feet Only</h2><p>--- Success ---</p>";
    //test feet and '
    htmlStr += test("-3feet");
    htmlStr += test("3 feet");
    htmlStr += test("3'");
    htmlStr += test("3 '");
    htmlStr += test("   3'    ");
    htmlStr += test("     3 feet");
    htmlStr += test("     3 feet    ");
    //failures
    htmlStr += "<p>--- Failures ---</p>";
    htmlStr += test("feet3feet");
    htmlStr += test("3feet feet");
    htmlStr += test("3' 3'");
    htmlStr += test("3''");
    htmlStr += test("   3'   '");
    $("#log-console").html(htmlStr);
}

function testMatchInchesOnly()
{
    var htmlStr = $("#log-console").html();
    function test(s) { return "<p>"+s+": " + (matchInchesOnly(s) ? "YES" : "NO");} 
    htmlStr += "<h2>Match Inches Only</h2><p>--- Success ---</p>";
    htmlStr += test('-300inches');
    htmlStr += test('3 inches');
    htmlStr += test('     3 inches');
    htmlStr += test('     3 inches    ');
    htmlStr += test('-3in');
    htmlStr += test('3 in');
    htmlStr += test('     3 in');
    htmlStr += test('     3 in    ');
    htmlStr += test('-3.2"');
    htmlStr += test('3 "');
    htmlStr += test('   3"    ');
    //failures
    htmlStr += "<p>--- Failures ---</p>";
    htmlStr += test('-1/3 in');
    htmlStr += test('inches3inches');
    htmlStr += test('3inches inches');
    htmlStr += test('3" 3"');
    htmlStr += test('3""');
    htmlStr += test('   3"   "');
    htmlStr += test('3 " no good');
    $('#log-console').html(htmlStr);
}

function testMatchInchFractionOnly()
{
    var htmlStr = $("#log-console").html();
    function test(s) { return "<p>"+s+": " + (matchInchFractionOnly(s) ? "YES" : "NO"); }
    htmlStr += "<h2>Match Inch Fraction Only</h2><p>--- Success ---</p>";
    htmlStr += test('-1/3inches');
    htmlStr += test('1/3 inch');
    htmlStr += test('     1/3 inches');
    htmlStr += test('     1/3 inches    ');
    htmlStr += test('1/3in');
    htmlStr += test('1/3 in');
    htmlStr += test('     1/3 in');
    htmlStr += test('     1/3 in    ');
    htmlStr += test('1/3"');
    htmlStr += test('1/3 "');
    htmlStr += test('   1/3"    ');
    //failures
    htmlStr += "<p>--- Failures ---</p>";
    htmlStr += test('-3in');
    htmlStr += test('inches3inches');
    htmlStr += test('3inches inches');
    htmlStr += test(' 1 / 3 "');
    htmlStr += test('1 / 3""');
    htmlStr += test('   1/3"   "');
    htmlStr += test('1/3 " no good');
    $('#log-console').html(htmlStr);
}

function testMatchFeetInches()
{
    var htmlStr = $("#log-console").html();
    function test(s) { return "<p>"+s+": " + (matchFeetInches(s) ? "YES" : "NO"); }
    htmlStr += "<h2>Match Feet Inches</h2><p>--- Success ---</p>";
    htmlStr += test('-3\' -3"');
    htmlStr += test('3 \' 3 "');
    htmlStr += test('3feet 3inches');
    htmlStr += test('3 feet 3 inches');
    htmlStr += test('3ft 3in');
    htmlStr += test('3 ft 3 in');
    //failures
    htmlStr += "<p>--- Failures ---</p>";
    htmlStr += test('3\' 3\'');
    htmlStr += test('3ft 3ft\'');
    htmlStr += test('3" 3"');
    htmlStr += test('3""');
    htmlStr += test('   3"   "');
    htmlStr += test('3 " no good');
    $('#log-console').html(htmlStr);
}

function testMatchFeetInchesInchFraction()
{
    var htmlStr = $("#log-console").html();
    function test(s) { return "<p>"+s+": " + (matchFeetInchesInchFraction(s) ? "YES" : "NO"); }
    htmlStr += "<h2>Match Feet Inches (Inch Fraction)</h2><p>--- Success ---</p>";
    htmlStr += test('-3\' 3 -1/3"');
    htmlStr += test('3 \' 3 1/3 "');
    htmlStr += test('3feet 3 1/3inches');
    htmlStr += test('3 feet 3 1/3 inches');
    htmlStr += test('3ft 3 1/3in');
    htmlStr += test('3 ft 3 1/3 in');
    //failures
    htmlStr += "<p>--- Failures ---</p>";
    htmlStr += test('-3\' 3 3"');
    htmlStr += test('3\' 3\'');
    htmlStr += test('3ft 3ft\'');
    htmlStr += test('3" 3"');
    htmlStr += test('3""');
    htmlStr += test('   3"   "');
    htmlStr += test('3 " no good');
    $('#log-console').html(htmlStr);
}

function testMatchCentimeters()
{
    var htmlStr = $("#log-console").html();
    function test(s) { return "<p>"+s+": " + (matchCentimeterOnly(s) ? "YES" : "NO"); }
    htmlStr += "<h2>Match Centimeters Only</h2><p>--- Success ---</p>";
    htmlStr += test('300cm');
    htmlStr += test('3 cm ');
    htmlStr += test('3 centimeters');
    //failures
    htmlStr += "<p>--- Failures ---</p>";
    htmlStr += test('3m');
    htmlStr += test('3cmc');
    htmlStr += test('3mm');
    htmlStr += test('3""');
    htmlStr += test('   3"   "');
    htmlStr += test('3 " no good');
    $('#log-console').html(htmlStr);
}

function testParseLength()
{
    function test(s) { return "<p>"+s+": " + Units.ParseLength(s); }
    var htmlStr = $("#log-console").html();
    htmlStr += "<h2>Convert (Parse Length)</h2><p>--- Success ---</p>";
    //test feet and '
    htmlStr += test("-3feet");
    htmlStr += test("3 feet");
    htmlStr += test("3'");
    htmlStr += test("3 '");
    htmlStr += test("1/3\"");
    htmlStr += test("1/3 \"");
    htmlStr += test("3 ft 3 in");
    htmlStr += test("3ft 3in");
    htmlStr += test("3' 3 1/2\"");
    htmlStr += test("3ft 3 1/2in");
    htmlStr += test("1.2m");
    htmlStr += test("1.2 m");
    htmlStr += test("1200cm");
    htmlStr += test("1200 cm");
    htmlStr += test("1200mm");
    htmlStr += test("1200 mm");
    
    $("#log-console").html(htmlStr);
}

function runUnitTests()
{
    testMatchFeetOnly();
    testMatchInchesOnly();
    testMatchInchFractionOnly();
    testMatchFeetInches();
    testMatchFeetInchesInchFraction();
    testMatchCentimeters();
    testParseLength();
}

              