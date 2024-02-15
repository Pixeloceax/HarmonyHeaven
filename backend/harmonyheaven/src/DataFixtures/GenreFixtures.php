<?php

namespace App\DataFixtures;

use OpenAI;
use App\Entity\Genre;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Bundle\FixturesBundle\Fixture;

class GenreFixtures extends Fixture
{
    public function load(ObjectManager $manager)
    {

        $genres = [
            'Blues',
            'Brass & Military',
            "Children's",
            'Classical',
            'Electronic',
            'Country',
            'Funk / Soul',
            'Hip Hop',
            'Jazz',
            'Latin',
            'Non-Music',
            'Pop',
            'Reggae',
            'Rock',
            'Stage & Screen',
        ];

        foreach ($genres as $genreName) {
            $entity = new Genre();
            $entity->setName($genreName);
            $manager->persist($entity);
        }

        $manager->flush();
    }

}
