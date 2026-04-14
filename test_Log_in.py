from Log_in import registrar_interno, login_interno

def test_registrar():
    assert(registrar_interno("Laura", "1234") == True)
    assert(registrar_interno("Laura", "1234") == False)
    assert(registrar_interno("pepito", "1234") == True)
    assert(registrar_interno("pepito", "5678") == False)

def test_login():
    assert(login_interno("Mario", "1234") == False)
    assert(login_interno("susana", "1234") == False)
    
    registrar_interno("Mario", "1234")
    assert(login_interno("Mario", "1234") == True)
    assert(login_interno("Mario", "5678") == False)

    registrar_interno("susana", "5678")
    assert(login_interno("susana", "5678") == True)
    assert(login_interno("susana", "1234") == False)