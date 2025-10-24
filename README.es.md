
# 🛡️ KeyPing

**KeyPing** es una aplicación de escritorio que detecta cuándo un usuario intenta crear una contraseña demasiado similar o idéntica a otra que ya ha usado anteriormente — ayudando a mejorar la higiene personal de contraseñas.

A diferencia de un gestor de contraseñas, **KeyPing no guarda ni autocompleta credenciales.**  
Solo analiza patrones de contraseñas de forma local y alerta cuando una nueva se parece demasiado a una antigua.

---

## ✨ Características

- 💾 **Almacenamiento totalmente local**, cifrado con AES  
- 🔍 **Detección de similitud** mediante distancia de Levenshtein y comparación parcial de hash  
- ⚠️ **Alertas inteligentes** ante contraseñas reutilizadas o predecibles  
- 🎨 **Interfaz moderna y minimalista**, creada con Angular + Electron  
- 🔐 **Funciona sin conexión**, sin nube, sin cuentas y sin rastreo

---

## 🧩 Tecnologías principales

| Capa | Tecnología |
|:------|:------------|
| Interfaz | Angular |
| Entorno de escritorio | Electron |
| Lógica local | Node.js (o .NET 9 Minimal API opcional) |
| Cifrado | AES-256-GCM (Node crypto) |
| Compilación | Electron Builder |

---

## 🧭 Objetivo del proyecto

Desarrollar un MVP pulido que demuestre:
- Detección local y segura de patrones de contraseñas  
- Diseño centrado en la privacidad, sin conexión  
- Interfaz moderna e intuitiva  
- Compatibilidad multiplataforma (Windows, Linux, macOS)

---

## 🚀 Cómo empezar (MVP)

> La guía detallada se añadirá conforme avance el desarrollo.

```bash
# clonar repositorio
git clone https://github.com/zulaa9/keyping.git
cd keyping

# instalar dependencias
npm install

# ejecutar angular + electron en modo desarrollo
npm run dev
```
---
### 📜 License
Publicado bajo la [Licencia MIT](LICENSE).

---

👤 Desarrollado por **Unax Zulaika Fuente**

📍 [Github](https://github.com/Unax-Zulaika-Fuente)
