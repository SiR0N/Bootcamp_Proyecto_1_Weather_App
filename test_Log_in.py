from Log_in import _registrar

def test_registrar():
    assert(_registrar("Laura", "1234") == True)
    assert(_registrar("Laura", "1234") == False)
    assert(_registrar("pepito", "1234") == True)
    assert(_registrar("pepito", "5678") == False)