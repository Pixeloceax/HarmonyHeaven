<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use App\Repository\UserRepository;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use App\Repository\ProductRepository;
use App\Repository\GenreRepository;
use App\Repository\StyleRepository;
use Symfony\Component\HttpFoundation\Request;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\String\Slugger\AsciiSlugger;
use App\Entity\Product;
use Symfony\Component\Uid\Uuid;


#[IsGranted('ROLE_ADMIN', message: 'Only admin can access this route')]
class AdminBoardController extends AbstractController
{

    // ---------------------------------------- USER CRUD ADMIN ----------------------------------------

    /**
     * @Route("/admin/users", name="getAllUsers", methods={"GET"})
     */
    public function getAllUsers(UserRepository $userRepository): JsonResponse
    {
        $users = $userRepository->findAll();

        $usersArray = [];
        foreach ($users as $user) {
            if (
                $user->getRoles() != [
                    "ROLE_ADMIN",
                    "ROLE_USER"
                ]
            ) {
                $usersArray[] = [
                    'id' => $user->getId(),
                    'name' => $user->getName(),
                    'user' => $user->getEmail(),
                    'address' => $user->getAddress(),
                    'phone' => $user->getPhone(),
                    'roles' => $user->getRoles(),
                ];
            }
        }
        return new JsonResponse($usersArray, 200);
    }

    /**
     * @Route("/admin/users/{id}", name="getUserById", methods={"GET"})
     */
    public function getUserById(Uuid $id, UserRepository $userRepository): JsonResponse
    {
        $user = $userRepository->findOneBy(['id' => $id]);

        if (!$user) {
            return new JsonResponse(['error' => 'User not found'], 404);
        }

        return new JsonResponse([
            'id' => $user->getId(),
            'name' => $user->getName(),
            'user' => $user->getEmail(),
            'address' => $user->getAddress(),
            'phone' => $user->getPhone(),
            'roles' => $user->getRoles(),
        ], 200);
    }

    /**
     * @Route("/admin/users/{id}", name="updateUserInformation", methods={"PUT"})
     */
    public function updateUserInformation(
        Uuid $id,
        UserRepository $userRepository,
        Request $request,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $user = $userRepository->findOneBy(['id' => $id]);
        if (!$user) {
            return new JsonResponse(['error' => 'User not found'], 404);
        }

        $data = json_decode($request->getContent(), true);

        if (isset($data['name'])) {
            $user->setName($data['name']);
        }
        if (isset($data['email'])) {
            $user->setEmail($data['email']);
        }
        if (isset($data['address'])) {
            $user->setAddress($data['address']);
        }
        if (isset($data['phone'])) {
            $user->setPhone($data['phone']);
        }
        if (isset($data['roles'])) {
            $user->setRoles($data['roles']);
        }

        $entityManager->flush();

        return new JsonResponse(['status' => 'User updated!'], 200);
    }
    /**
     * @Route("/admin/users/{id}", name="deleteUser", methods={"DELETE"})
     */
    public function deleteUser(
        Uuid $id,
        UserRepository $userRepository,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $user = $userRepository->findOneBy(['id' => $id]);

        if (!$user) {
            return new JsonResponse(['error' => 'User not found'], 404);
        }

        $entityManager->remove($user);
        $entityManager->flush();

        return new JsonResponse(['status' => 'User deleted'], 200);
    }


    // ---------------------------------------- PRODUCT CRUD ADMIN ----------------------------------------

    /**
     * @Route("/admin/products", name="getAllProducts", methods={"GET"})
     */
    public function getAllProducts(
        ProductRepository $productRepository,
        GenreRepository $genreRepository,
        StyleRepository $styleRepository
    ): JsonResponse {
        $products = $productRepository->findAll();

        $productsArray = [];

        foreach ($products as $product) {
            $genres = $product->getGenre()->toArray();
            $styles = $product->getStyle()->toArray();

            $genresArray = array_map(function ($genre) {
                return ['name' => $genre->getName()];
            }, $genres);

            $stylesArray = array_map(function ($style) {
                return ['name' => $style->getName()];
            }, $styles);

            $productsArray[] = [
                'id' => $product->getId(),
                'image' => $product->getImage(),
                'name' => $product->getName(),
                'slug' => $product->getSlug(),
                'description' => $product->getDescription(),
                'price' => $product->getPrice(),
                'quantity' => $product->getQuantity(),
                'type' => $product->getType(),
                'label' => $product->getLabel(),
                'year' => $product->getYear(),
                'country' => $product->getCountry(),
                'format' => $product->getFormat(),
                'artist' => $product->getArtist(),
                'genre' => $genresArray,
                'style' => $stylesArray,
            ];
        }

        return new JsonResponse($productsArray, 200);
    }


    /**
     * @Route("/admin/products/{id}", name="updateProductInformation", methods={"PUT"})
     */
    public function updateProductsInformation(
        int $id,
        ProductRepository $productRepository,
        GenreRepository $genreRepository,
        StyleRepository $styleRepository,
        Request $request,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $product = $productRepository->findOneBy(['id' => $id]);

        if (!$product) {
            return new JsonResponse(['error' => 'Product not found'], 404);
        }

        $data = json_decode($request->getContent(), true);

        $this->productRequirment($product, $data);

        $entityManager->flush();

        return new JsonResponse(['status' => 'Product updated!'], 200);
    }

    /**
     * @Route("/admin/products/{id}", name="deleteProduct", methods={"DELETE"})
     */
    public function deleteProduct(
        int $id,
        ProductRepository $productRepository,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $product = $productRepository->findOneBy(['id' => $id]);

        if (!$product) {
            return new JsonResponse(['error' => 'Product not found'], 404);
        }

        $entityManager->remove($product);
        $entityManager->flush();

        return new JsonResponse(['status' => 'Product deleted'], 200);
    }

    /**
     * @Route("/admin/products", name="createProduct", methods={"POST"})
     */
    public function createProduct(
        Request $request,
        EntityManagerInterface $entityManager,
        GenreRepository $genreRepository,
        StyleRepository $styleRepository
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        $product = new Product();

        $this->productRequirment($product, $data);

        $entityManager->persist($product);
        $entityManager->flush();

        return new JsonResponse(['status' => 'Product created!'], 201);
    }
    private function productRequirment(
        $product,
        $data,
    ) {
        if (isset($data['image'])) {
            $product->setImage($data['image']);
        }
        if (isset($data['name'])) {
            $product->setName($data['name']);
            $slugger = new AsciiSlugger();
            $slug = $slugger->slug($data['name'])->lower();
            $product->setSlug($slug);
        }
        if (isset($data['description'])) {
            $product->setDescription($data['description']);
        }
        if (isset($data['price'])) {
            $product->setPrice($data['price']);
        }
        if (isset($data['quantity'])) {
            $product->setQuantity($data['quantity']);
        }
        if (isset($data['type'])) {
            $product->setType($data['type']);
        }
        if (isset($data['label'])) {
            $product->setLabel($data['label']);
        }
        if (isset($data['year'])) {
            $product->setYear($data['year']);
        }
        if (isset($data['country'])) {
            $product->setCountry($data['country']);
        }
        if (isset($data['format'])) {
            $product->setFormat($data['format']);
        }
        if (isset($data['artist'])) {
            $product->setArtist($data['artist']);
        }
    }
}
