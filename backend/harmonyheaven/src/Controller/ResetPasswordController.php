<?php

namespace App\Controller;

use App\Service\EmailService;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class ResetPasswordController extends AbstractController
{

    private $emailService;
    
    public function __construct(EmailService $emailService)
    {
        $this->emailService = $emailService;
    }

    /**
     * @Route("/forgot-password", name="forgot-password", methods={"POST"})
     */
    public function forgotPassword(Request $request, UserRepository $userRepository, EntityManagerInterface $em): JsonResponse
    {
        /* Récupérer les données, puis l'utilisateur à partir de ces données */
        $data = json_decode($request->getContent(), true);
        if ($data === null) {
            return new JsonResponse(['message' => 'Une erreur est survenue'], 404);
        }
        $user = $userRepository->findOneBy(['email' => $data['email']]);
        if (!$user) {
            return new JsonResponse(['message' => 'Si une adresse mail correspondate existe, un mail pour 
            changer votre mot de passe a été envoyé. Pensez à vérifier vos spams'], 200);
        } else {
            /* Génération du token */
            $randomToken = bin2hex(random_bytes(16));
            $timestamp = time() + 86400 ;
            $user->setToken($randomToken);
            $user->setTokenExpires($timestamp);
            $em->persist($user);
            $em->flush();
            $this->emailService->sendWithTemplate(
                'harmonyheaven.noreply@gmail.com',
                $user->getEmail(),
                'Réinitialisation de votre mot de passe',
                'emails/resetpassword.html.twig',
                [
                    'token' => $user->getToken(),
                ]
            );
            return new JsonResponse(['message' => 'Si une adresse mail correspondate existe, un mail pour 
            changer votre mot de passe a été envoyé. Pensez à vérifier vos spams'], 200);
        }
    }

    /**
     * @Route("/check-token", name="check-token", methods={"POST"})
     */
    public function checkToken(Request $request, UserRepository $userRepository): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        
        // Assurez-vous que le token est présent dans les données
        $token = $data['token'];
        
        // Utilisez findOneBy pour récupérer un seul utilisateur par le token
        $user = $userRepository->findOneBy(['token' => $token]);

        $response = $this->checkValidity($user, $token);
        return $response;
    }

    /**
     * @Route("/reset-password", name="reset-password", methods={"POST"})
     */
    public function resetPassword(Request $request, UserRepository $userRepository, UserPasswordHasherInterface $passwordHasher,
    EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $token = $data['token'];
        $password = $data['password'];
        
        // Utilisez findOneBy pour récupérer un seul utilisateur par le token
        $user = $userRepository->findOneBy(['token' => $token]);

        $response = $this->checkValidity($user, $token, true, $passwordHasher, $password, $em);
        return $response;
    }

    private function checkValidity($user, $token, $resetPassword = false, UserPasswordHasherInterface $passwordHasher = null, $password = null, EntityManagerInterface $em = null): JsonResponse
    {
        if (!$user) {
            return new JsonResponse(['message' => 'Une erreur est survenue'], 404);
        }

        $tokenExpires = $user->getTokenExpires();
        $currentTime = time();

        if (!$token) {
            return new JsonResponse(['message' => 'Unknown token'], 404);
        }

        if ($currentTime > $tokenExpires) {
            return new JsonResponse(['message' => 'Le token a expiré. Effectuez une nouvelle demande.'], 400);
        }

        // Check if the password reset logic should be performed
        if ($resetPassword && $passwordHasher && $password !== null) {
            /* Vérifier qu'un mdp a été soumis */
            if (!$password) {
                return new JsonResponse(['message' => 'Vous devez choisir un mdp'], 404);
            }

            /* Vérifier que le mdp est différent de l'ancien */
            if($passwordHasher->isPasswordValid($user, $password)) {
                return new JsonResponse(['message' => 'Votre nouveau mdp doit être différent de l\'ancien.'], 400);
            }

            // Vérifier que tt est valide
            if($currentTime <= $tokenExpires &&  $user && $token) {
                $user->setPassword($passwordHasher->hashPassword($user, $password));
                $user->setToken(null);
                $user->setTokenExpires(null);
                $em->persist($user);
                $em->flush($user);
                return new JsonResponse(['message' => 'Changement de mot de passe effectué'], 200);
            }
        }
    }
}
