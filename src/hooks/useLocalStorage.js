import { useState, useEffect } from 'react'


export default function useLocalStorage(key, initialValue) {
const [state, setState] = useState(() => {
try {
const v = localStorage.getItem(key)
return v ? JSON.parse(v) : initialValue
} catch (e) {
return initialValue
}
})


useEffect(() => {
try {
localStorage.setItem(key, JSON.stringify(state))
} catch (e) {}
}, [key, state])


return [state, setState]
}