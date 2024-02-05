<?php

namespace App\Controller;

use App\Repository\GenreRepository; 
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class GenreController extends AbstractController
{
    /**
     * @Route("/genres-list", name="genres-list", methods={"GET"})
     */
    public function getGenres(GenreRepository $genreRepository): JsonResponse
    {
        $genres = $genreRepository->findAll();
        $genresArray = [];
        foreach ($genres as $genre) {
            $genresArray[] = [
                'id' => $genre->getId(),
                'name' => $genre->getName(),
            ];
        }

        return new JsonResponse($genresArray, 200);
    }
}
