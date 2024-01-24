<?php

namespace App\DataFixtures;

use App\Entity\Genre;
use App\Entity\Style;
use App\Entity\Product;
use App\DataFixtures\GenreFixtures;
use App\DataFixtures\StyleFixtures;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Symfony\Component\String\Slugger\AsciiSlugger;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;

class ProductFixtures extends Fixture implements DependentFixtureInterface
{
    private $consumerKey;
    private $consumerSecret;

    public function __construct($consumerKey, $consumerSecret)
    {
        $this->consumerKey = $consumerKey;
        $this->consumerSecret = $consumerSecret;
    }

    public function load(ObjectManager $manager): void
    {
        $consumerKey = $this->consumerKey;
        $consumerSecret = $this->consumerSecret;

        $url = 'https://api.discogs.com/users/HempMe/collection/folders/0/releases';
        $headers = [
            'Authorization: Discogs key=' . $consumerKey . ', secret=' . $consumerSecret,
            'User-Agent: VotreApplication/Version'
        ];

        $options = [
            'http' => [
                'header' => implode("\r\n", $headers),
                'method' => 'GET',
            ],
        ];

        $context = stream_context_create($options);
        $response = file_get_contents($url, false, $context);

        // Vérifier si la requête a réussi (code HTTP 200)
        if ($response !== false) {
        // Décoder la réponse JSON
        $data = json_decode($response, true);

        // Vérifier si la réponse est valide
            if ($data && isset($data['releases'])) {
            // Loop through results
            foreach ($data['releases'] as $result) {
                $product = new Product();
                $product->setName($result['basic_information']['title']);
                $product->setYear($result['basic_information']['year']);
                $product->setFormat($result['basic_information']['formats'][0]['name']);
                $product->setLabel($result['basic_information']['labels'][0]['name']);
                $product->setImage($result['basic_information']['cover_image']);

                $slugger = new AsciiSlugger();
                $slug = $slugger->slug($result['basic_information']['title'])->lower();
                $product->setSlug($slug);

                $product->setPrice(rand(1500, 4000) / 100);
                $product->setType('release');

                $vinylDescriptions = $result['basic_information']['formats'][0]['descriptions']; // Assurez-vous d'ajuster le chemin en fonction de votre structure de données

                // Vérifiez si des descriptions existent avant de les traiter
                if (!empty($vinylDescriptions)) {
                    // Convertissez le tableau en une chaîne avec des listes à puce
                    $formattedDescriptions = implode('<br>', array_map(function ($description) {
                        return '• ' . htmlspecialchars($description); // Vous devriez échapper les caractères pour éviter des problèmes de sécurité
                    }, $vinylDescriptions));
                    // Stockez la chaîne dans le champ "description" de votre entité
                    $product->setDescription($formattedDescriptions);
                } else {
                    // Si aucune description n'est disponible, vous pouvez définir une valeur par défaut ou laisser le champ vide
                    $product->setDescription('Aucune description disponible');
                }

                foreach($result['basic_information']['genres'] as $genreName) {
                    $genre = $manager->getRepository(Genre::class)->findOneBy(['name' => $genreName]);
                    if($genre) {
                        $product->addGenre($genre);
                    }
                    else {
                        // Vérification, en cas d'erreur aller vérifier la syntaxe du genre dans GenreFixtures.php
                        dump('Genre not found: ' . $genreName);
                    }
                }

                foreach($result['basic_information']['styles'] as $styleName) {
                    $style = $manager->getRepository(Style::class)->findOneBy(['name' => $styleName]);
                    if ($style) {
                    $product->addStyle($style);
                    } else {
                    // Vérification, en cas d'erreur aller vérifier la syntaxe du style dans StyleFixtures.php
                    dump('Style not found: ' . $styleName);
                    }
                }
                $artists = [];

                foreach ($result['basic_information']['artists'] as $artistData) {
                    // Ajoute le nom de l'artiste au tableau
                    $artists[] = $artistData['name'];
                    // Si le champ "join" n'est pas vide, ajoute le champ "join" et le nom du deuxième artiste
                    if (!empty($artistData['join'])) {
                        $artists[] = $artistData['join'];
                        $artists[] = $artistData['tracks'];
                    }
                }
                // Concatène les noms des artistes avec l'espace comme séparateur
                $artistName = implode(' ', $artists);
                $product->setArtist($artistName);

                // Ajoutez d'autres propriétés selon les besoins
                $releaseUrl = $result['basic_information']['resource_url'];
                $releaseResponse = file_get_contents($releaseUrl, false, $context);

            if ($releaseResponse !== false) {
                $releaseData = json_decode($releaseResponse, true);
                if (isset($releaseData['country'])) {
                    $product->setCountry($releaseData['country']);
                } else {
                    $product->setCountry('Unknown');
                }
                } else {
                    $product->setCountry('Unknown');
                }
                    $manager->persist($product);
                }
                } else {
                    dump('Erreur lors de la récupération des données.');
                }
                } else {
                    dump('La requête a échoué. Assurez-vous que votre clé API est correcte et que vous avez les autorisations nécessaires.');
            }
        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [
            GenreFixtures::class,
            StyleFixtures::class,
        ];
    }
}
