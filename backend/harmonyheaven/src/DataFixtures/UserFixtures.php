<?php

namespace App\DataFixtures;

use DateTime;
use App\Entity\Cart;
use App\Entity\User;
use App\Entity\Command;
use App\Entity\Payment;
use App\Entity\Product;
use App\Entity\CartItem;
use App\Entity\Delivery;
use App\Entity\CommandItem;
use App\Entity\PaymentMethod;
use App\Entity\DeliveryInformation;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class UserFixtures extends Fixture implements DependentFixtureInterface
{
    private UserPasswordHasherInterface $passwordHasher;

    public function __construct(UserPasswordHasherInterface $passwordHasher)
    {
        $this->passwordHasher = $passwordHasher;
    }

    public function load(ObjectManager $manager): void
    {
        $this->loadAdminUser($manager);
        $this->loadRandomUsers($manager);
    }

    private function loadAdminUser(ObjectManager $manager): void
    {
        $admin = new User();
        // Set admin data
        $admin->setRoles(['ROLE_ADMIN'])
            ->setEmail($_ENV['ADMIN_EMAIL'])
            ->setPassword($this->passwordHasher->hashPassword($admin, $_ENV['ADMIN_PASSWORD']))
            ->setName('Pisha')
            ->setAddress('17, rue Isabeau de Roubaix. 59100 ROUBAIX')
            ->setPhone('07.66.85.97.92');

        // Create and associate entities
        $cart = $this->createCart($manager);
        $admin->setCart($cart);

        $paymentMethod = $manager->getRepository(PaymentMethod::class)->findOneBy(['name' => 'Credit Card']);
        $payment = $this->createPayment($paymentMethod);
        $delivery = $this->createDelivery($admin->getAddress());
        $deliveryInformation = $this->createDeliveryInformation($delivery);

        $manager->persist($deliveryInformation);

        $command = $this->createCommand($admin, $payment, $delivery);
        $admin->addCommand($command);

        $this->addRandomCartItems($cart, $manager);
        $this->addRandomCommandItems($command, $manager);

        $this->persistAndFlush($manager, $admin);
    }

    private function createCart(ObjectManager $manager): Cart
    {
        $cart = new Cart();
        $manager->persist($cart);

        return $cart;
    }

    private function createPayment(PaymentMethod $paymentMethod): Payment
    {
        $payment = new Payment();
        $payment->setPaymentMethod($paymentMethod)
        ->setAmountPaid(100)
            ->setStatus(0);

        return $payment;
    }

    private function createDelivery(string $address): Delivery
    {
        $delivery = new Delivery();
        $delivery->setAddress($address)
            ->setDeliveryCost(50)
            ->setDeliveryDate(new DateTime())
            ->setDeliveryMethod("credit card")
            ->setStatus(0);

        return $delivery;
    }

    private function createDeliveryInformation(Delivery $delivery): DeliveryInformation
    {
        $deliveryInformation = new DeliveryInformation();
        $deliveryInformation->setDelivery($delivery);

        return $deliveryInformation;
    }

    private function createCommand(User $admin, Payment $payment, Delivery $delivery): Command
    {
        $command = new Command();
        $command->setPayment($payment)
            ->setDelivery($delivery)
            ->setStatut(0)
            ->setQuantity(mt_rand(1, 5));
        $admin->addCommand($command);

        return $command;
    }

    private function addRandomCartItems(Cart $cart, ObjectManager $manager): void
    {
        $products = $manager->getRepository(Product::class)->findAll();

        for ($j = 0; $j < 5; $j++) {
            $cartItem = new CartItem();
            $product = $products[array_rand($products)]; // Select a random product
            $cartItem->setProduct($product)
                ->setQuantity(mt_rand(1, 5));

            $cart->addCartItem($cartItem);
        }
    }

    private function addRandomCommandItems(Command $command, ObjectManager $manager): void
    {
        $products = $manager->getRepository(Product::class)->findAll();

        for ($j = 0; $j < 5; $j++) {
            $commandItem = new CommandItem();
            $product = $products[array_rand($products)]; // Select a random product
            $commandItem->setProduct($product)
                ->setQuantity(mt_rand(1, 5));

            $command->addCommandItem($commandItem);
        }
    }

    private function loadRandomUsers(ObjectManager $manager): void
    {
        $faker = \Faker\Factory::create('fr_FR');

        for ($i = 0; $i < 10; $i++) {
            $user = new User();
            $user->setRoles(['ROLE_USER'])
                ->setEmail($faker->email)
                ->setPassword($this->passwordHasher->hashPassword($user, '123test'))
                ->setName($faker->firstName)
                ->setAddress(sprintf('%s, %s, %s', $faker->streetAddress, strtoupper(str_replace(' ', '', $faker->postcode)), strtoupper($faker->city)))
                ->setPhone(sprintf('%s.%d.%d.%d.%d', $faker->randomElement(['06', '07']), $faker->numberBetween(10, 99), $faker->numberBetween(10, 99), $faker->numberBetween(10, 99), $faker->numberBetween(10, 99)));

            $manager->persist($user);
        }

        $this->persistAndFlush($manager);
    }

    private function persistAndFlush(ObjectManager $manager, $entity = null): void
    {
        try {
            if ($entity !== null) {
                $manager->persist($entity);
            }
            $manager->flush();
        } catch (\Exception $e) {
            // Output or log the exception message
            echo $e->getMessage();
        }
    }

    public function getDependencies(): array
    {
        return [
            ProductFixtures::class,
            PaymentMethodFixtures::class,
        ];
    }
}
