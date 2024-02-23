<?php

namespace App\Entity;

use App\Repository\DeliveryRepository;
use Doctrine\DBAL\Types\Types;
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
    private ?Command $command = null;

    #[ORM\Column(type: Types::DATE_MUTABLE, nullable:true)]
    private ?\DateTimeInterface $deliveryDate = null;

    #[ORM\Column(nullable:true)]
    private ?float $deliveryCost = null;

    #[ORM\Column(length: 255, nullable:true)]
    private ?string $deliveryMethod = null;

    #[ORM\Column(length: 255)]
    private ?string $tracking_details = null;

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

    public function getDeliveryDate(): ?\DateTimeInterface
    {
        return $this->deliveryDate;
    }

    public function setDeliveryDate(\DateTimeInterface $deliveryDate): static
    {
        $this->deliveryDate = $deliveryDate;

        return $this;
    }

    public function getDeliveryCost(): ?float
    {
        return $this->deliveryCost;
    }

    public function setDeliveryCost(float $deliveryCost): static
    {
        $this->deliveryCost = $deliveryCost;

        return $this;
    }

    public function getDeliveryMethod(): ?string
    {
        return $this->deliveryMethod;
    }

    public function setDeliveryMethod(string $deliveryMethod): static
    {
        $this->deliveryMethod = $deliveryMethod;

        return $this;
    }

    public function getTrackingDetails(): ?string
    {
        return $this->tracking_details;
    }

    public function setTrackingDetails(string $tracking_details): static
    {
        $this->tracking_details = $tracking_details;

        return $this;
    }

}
