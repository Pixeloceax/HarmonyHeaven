<?php

namespace App\DataFixtures;

use OpenAI;
use App\Entity\Genre;
use App\Entity\PaymentMethod;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Bundle\FixturesBundle\Fixture;

class PaymentMethodFixtures extends Fixture
{
    public function load(ObjectManager $manager)
    {
        $paymentMethod = new PaymentMethod();
        $paymentMethod->setName('Credit Card');
        $paymentMethod->setDescription('cc');
        $manager->persist($paymentMethod);
        $manager->flush();
    }

}
