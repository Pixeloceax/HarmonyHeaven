<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class RegistrationController extends AbstractController
{
    /**
     * @Route("/register", name="register", methods={"POST"})
     */
    public function register(Request $request, UserRepository $userRepository, UserPasswordHasherInterface $passwordHasher,
    EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $username = $data['username'];
        $email = $data['email'];
        $password = $data['password'];

        // Vérifier qu'un user avec ce mail n'existe pas déjà en BDD
        $userInDb = $userRepository->findOneBy(['email' => $email]);
        if($userInDb) {
            return new JsonResponse(['error' => 'Une erreur est survenue.'], JsonResponse::HTTP_BAD_REQUEST);
        }

        $user = new User();
        $user->setName($username)
            ->setEmail($email)
            ->setPassword($passwordHasher->hashPassword($user, $password))
            ->setRoles(['ROLE_USER']);
        $em->persist($user);
        $em->flush();

            return new JsonResponse(['message' => 'Compte crée avec succès !']);
    }
}
