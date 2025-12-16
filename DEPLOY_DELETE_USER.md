# 🗑️ Desplegar Función de Eliminación Completa de Usuarios

## ✅ Cambios Implementados

### 1. **Cloud Function** (`functions/index.js`)
Nueva función `deleteUserCompletely` que:
- ✅ Verifica que el caller sea super admin o admin
- ✅ Borra todas las facturas/PDFs del usuario
- ✅ Elimina documento de Firestore
- ✅ **Borra cuenta de Firebase Authentication** (usando Admin SDK)
- ✅ Previene que el usuario vuelva a iniciar sesión

### 2. **Frontend** (`AuthContext.jsx`)
- Modificada función `deleteUser()` para llamar a la Cloud Function
- Muestra cantidad de facturas eliminadas

### 3. **UI** (`AdminDashboard.jsx`)
- Modal de confirmación mejorado con advertencias claras
- Mensaje de éxito muestra facturas borradas

---

## 🚀 Cómo Desplegar

### Opción 1: Desplegar Solo Functions (Recomendado)
```bash
cd functions
npm install
cd ..
firebase deploy --only functions
```

### Opción 2: Desplegar Todo
```bash
firebase deploy
```

---

## 🧪 Cómo Probar

1. **Iniciar sesión como super admin** (`franco_burgoa1@hotmail.com`)
2. Ir al **Panel de Administración**
3. Seleccionar un usuario de prueba
4. Click en botón **"Eliminar"** (icono de basura)
5. Leer el modal de confirmación que dice:
   ```
   ⚠️ Esta acción borrará:
   • Cuenta de autenticación
   • Todos los datos de Firestore
   • Todas las facturas/PDFs cargados
   • No podrá volver a iniciar sesión
   ```
6. Confirmar eliminación
7. Verificar mensaje: `✅ Usuario eliminado completamente. X facturas borradas.`
8. **Intentar iniciar sesión** con ese usuario → Debe fallar

---

## 🔒 Seguridad

- Solo **super admins** y **admins** pueden eliminar usuarios
- No puedes eliminar tu propia cuenta desde el panel
- Se verifica autenticación en la Cloud Function
- Logs completos de cada eliminación en Firebase Console

---

## 📊 Qué Se Borra

| Item | Ubicación | Estado |
|------|-----------|--------|
| Cuenta de autenticación | Firebase Auth | ✅ Eliminada |
| Datos de usuario | Firestore `/users/{uid}` | ✅ Eliminado |
| Facturas/PDFs | Firestore `/invoices` | ✅ Todas borradas |
| Login futuro | Firebase Auth | ❌ Bloqueado |

---

## ⚠️ Importante

- La eliminación es **PERMANENTE** e **IRREVERSIBLE**
- No hay recuperación de datos
- El usuario no podrá crear una nueva cuenta con el mismo email inmediatamente
- Los logs se mantienen en Firebase Console por auditoría

---

## 🐛 Troubleshooting

### Error: "Usuario no autorizado"
- Verifica que estás logueado como super admin
- Revisa que el email sea exactamente `franco_burgoa1@hotmail.com`

### Error: "Error al eliminar usuario"
- Verifica que las Cloud Functions estén desplegadas
- Revisa los logs en Firebase Console → Functions

### Las facturas no se borran
- Verifica que la colección se llame exactamente `invoices`
- Revisa el campo `userId` en las facturas

---

## 📝 Comando Rápido

```bash
# Desplegar función
firebase deploy --only functions:deleteUserCompletely

# Ver logs en tiempo real
firebase functions:log --only deleteUserCompletely
```

---

## ✨ Resultado Final

Cuando el super admin elimine a un usuario:
1. ✅ Se borra su cuenta de autenticación
2. ✅ Se eliminan todos sus datos
3. ✅ Se borran todas sus facturas
4. ✅ No puede volver a iniciar sesión
5. ✅ No deja rastros en la base de datos

**Usuario completamente eliminado del sistema** 🎯
