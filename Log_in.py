import hashlib

# Diccionario para guardar usuarios
usuarios = {}

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

def registrar():
    print("\n=== REGISTRO ===")
    usuario = input("Usuario: ")
    password = input("Contraseña: ")

    if usuario in usuarios:
        print("Ese usuario ya existe.")
        return

    usuarios[usuario] = hash_password(password)
    print("Usuario registrado correctamente.")

def login():
    print("\n=== LOGIN ===")
    usuario = input("Usuario: ")
    password = input("Contraseña: ")

    if usuario in usuarios and usuarios[usuario] == hash_password(password):
        print("Login exitoso 🎉")
    else:
        print("Usuario o contraseña incorrectos.")

def menu():
    while True:
        print("\n1. Registrar")
        print("2. Login")
        print("3. Salir")

        opcion = input("Elige una opción: ")

        if opcion == "1":
            registrar()
        elif opcion == "2":
            login()
        elif opcion == "3":
            print("¡Hasta pronto! 👋")
            break
        else:
            print("Opción inválida")

menu()