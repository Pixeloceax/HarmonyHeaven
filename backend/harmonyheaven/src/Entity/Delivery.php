<?php

namespace App\Entity;

use App\Repository\DeliveryRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: DeliveryRepository::class)]
class Delivery
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $address = null;

    #[ORM\Column(length: 255)]
    private ?string $status = null;

    #[ORM\OneToOne(mappedBy: 'delivery', cascade: ['persist', 'remove'])]
    private ?DeliveryInformation $deliveryInformation = null;

    #[ORM\OneToOne(mappedBy: 'delivery', cascade: ['persist', 'remove'])]
    private ?Command $command = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getAddress(): ?string
    {
        return $this->address;
    }

    public function setAddress(string $address): static
    {
        $this->address = $address;

        return $this;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): static
    {
        $this->status = $status;

        return $this;
    }

    public function getDeliveryInformation(): ?DeliveryInformation
    {
        return $this->deliveryInformation;
    }

    public function setDeliveryInformation(DeliveryInformation $deliveryInformation): static
    {
        // set the owning side of the relation if necessary
        if ($deliveryInformation->getDelivery() !== $this) {
            $deliveryInformation->setDelivery($this);
        }

        $this->deliveryInformation = $deliveryInformation;

        return $this;
    }

    public function getCommand(): ?Command
    {
        return $this->command;
    }

    public function setCommand(Command $command): static
    {
        // set the owning side of the relation if necessary
        if ($command->getDelivery() !== $this) {
            $command->setDelivery($this);
        }

        $this->command = $command;

        return $this;
    }
}
