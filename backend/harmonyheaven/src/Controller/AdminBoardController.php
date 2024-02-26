<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use App\Repository\UserRepository;
use Lexik\Bundle\JWTAuthenticationBundle\Encoder\JWTEncoderInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[IsGranted('ROLE_ADMIN', message: 'Only admin can access this route')]
class AdminBoardController extends AbstractController
{
    /**
     * @Route("/admin/board", name="adminBoard", methods={"PUT"})
     */
    public function ManageUsersInformations(
        Request $request,
        JWTEncoderInterface $jwtEncoder,
        EntityManagerInterface $entityManager,
        UserRepository $userRepository,
        UserPasswordHasherInterface $passwordHasher,
        JWTTokenManagerInterface $jwtManager
    ): JsonResponse {
        $authHeader = $request->headers->get('Authorization');
        $authToken = str_replace('Bearer ', '', $authHeader);
        $decodedJwtToken = $jwtEncoder->decode($authToken);
        $userId = $decodedJwtToken['id'];
        $user = $userRepository->findOneBy(['id' => $userId]);

        if (!$user) {
            return new JsonResponse(['message' => 'User not found',], 404);
        }

        $data = json_decode($request->getContent(), true);

        $this->updateUserInformation($user, $data, $passwordHasher);

        $entityManager->persist($user);
        $entityManager->flush();

        return new JsonResponse(['message' => 'User board updated',], 200);
    }


    private function updateUserInformation(
        $user,
        $data,
        UserPasswordHasherInterface $passwordHasher
    ) {
        if (isset($data['name'])) {
            $user->setName($data['name']);
        }
        if (isset($data['email'])) {
            $user->setEmail($data['email']);
        }
        if (isset($data['password'])) {
            $user->setPassword($passwordHasher->hashPassword($user, $data['password']));
        }
        if (isset($data['address'])) {
            $user->setAddress($data['address']);
        }
        if (isset($data['phone'])) {
            $user->setPhone($data['phone']);
        }
    }
}
