
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n
  .use(initReactI18next)
  .init({
    lng: navigator.language,
    resources: {
      en: {
        translation: {
        "NEWS & HOT": "NEWS & HOT",
        "EXCEPTIONAL":"EXCEPTIONAL",
        "VINYLS":"VINYLS", 
        "HARMONY":"HARMONY",
        "HEAVEN":"HEAVEN",
        "Contact Us":"Contact Us",
        "Name":"Name",
        "Newsletter":"Newsletter",
        "Subscribe":"Subscribe",
        "Enter your email":"Enter your email",
        "By subscribing you agree to with our":"By subscribing you agree to with our",
        "Privacy Policy":"Privacy Policy",
        "home":"Home",
        "Home":"Home",
        "contact":"contact",
        "Contact":"Contact",
        "CONTACT":"CONTACT",
        "Term of Service":"Term of Service",
        "Cookie Settings":"Cookie Settings",
        "All rights reserved.":"All rights reserved.",
        "LOGOUT":"LOGOUT",
        "LOGIN":"LOGIN",
        "REGISTER":"REGISTER",
        "ABOUT":"ABOUT",
        "profil":"PROFIL",
        "Wishlist":"Wishlist",
        "orders":"Orders",
        "shop":"Shop",
        "close":"close",
        "Add to Cart":"Add to Cart",

      },
    },
    fr: {
      translation: {
        "NEWS & HOT": "NOUVEAUTÉ & MEILLEURES VENTES",
        "EXCEPTIONAL":"VINYLE",
        "VINYLS":"D'EXCEPTION",
        "HARMONY":"HARMONY",
        "HEAVEN":"HEAVEN",
        "Contact Us":"Nous contacter",
        "Name":"Nom",
        "Newsletter":"Newsletter",
        "Subscribe":"S'abonner",
        "Enter your email":"Entrez votre email",
        "By subscribing you agree to with our":"En vous abonnant, vous acceptez notre",
        "Privacy Policy":"politique de confidentialité",
        "home":"Accueil",
        "Home":"Accueil",
        "contact":"contacte",
        "Contact":"Contacte",
        "CONTACT":"CONTACTE",
        "Term of Service":"Conditions d'utilisation",
        "Cookie Settings":"Paramètres des Cookies",
        "All rights reserved.":"Tous droits réservés",
        "LOGOUT":"DÉCONNEXION",
        "LOGIN":"CONNEXION",
        "REGISTER":"INSCRIPTION",
        "about":"À PROPOS",
        "profil":"profile",
        "Wishlist":"liste de souhait",
        "orders":"commandes",
        "shop":"Boutique",
        "close":"fermer",
        "Add to Cart":"Ajouter au panier",

      },
    },
  },
});

export default i18n;
