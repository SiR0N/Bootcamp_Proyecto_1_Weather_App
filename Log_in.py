import hashlib

# Diccionario para guardar usuarios
usuarios = {}

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

def registrar_interno(usuario, password):
    if usuario in usuarios:
        return False

    usuarios[usuario] = hash_password(password)
    return True

def registrar():
    print("\n=== REGISTRO ===")
    usuario = input("Usuario: ")
    password = input("Contraseña: ")

    resultado = registrar_interno(usuario, password)
    if resultado == True:
        print("Usuario registrado correctamente.")
    else:
        print("Ese usuario ya existe.")
    return resultado

def login_interno(usuario, password):
    if usuario in usuarios and usuarios[usuario] == hash_password(password):
        return True
    else:
        return False
    
def login():
    print("\n=== LOGIN ===")
    usuario = input("Usuario: ")
    password = input("Contraseña: ")

    resultado = login_interno(usuario,password)
    if resultado == True:
        print("Login exitoso 🎉")
    else:
        print("Usuario o contraseña incorrectos.")
    return resultado

def menu():
    while True:
        print("\n1. Registrar")
        print("2. Login")
        print("3. Salir")

        opcion = input("Elige una opción: ")

        if opcion == "1":
            registrar()
        elif opcion == "2":
            if login() == True:
                return True
        elif opcion == "3":
            print("¡Hasta pronto! 👋")
            return False
        else:
            print("Opción inválida")

if __name__ =="__main__":
    menu()