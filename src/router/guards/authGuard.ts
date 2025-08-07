// guards/authGuard.ts
import {AuthConstants} from "@/model/constant.enum.ts";

export function authGuard(to, from, next) {
  const isLoggedIn = !!localStorage.getItem(AuthConstants.AT);
  console.log(isLoggedIn)
  if (to.meta.requiresAuth && !isLoggedIn) {
    return next({ name: 'login' });
  }

  next();
}
