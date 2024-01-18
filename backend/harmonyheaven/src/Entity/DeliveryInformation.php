<?php

namespace App\Entity;

use App\Repository\DeliveryInformationRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: DeliveryInformationRepository::class)]
class DeliveryInformation
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\OneToOne(inversedBy: 'deliveryInformation', cascade: ['persist', 'remove'])]
    #[ORM\JoinColumn(nullable: false)]
    private ?Delivery $delivery = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $tracking_details = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getDelivery(): ?Delivery
    {
        return $this->delivery;
    }

    public function setDelivery(Delivery $delivery): static
    {
        $this->delivery = $delivery;

        return $this;
    }

    public function getTrackingDetails(): ?string
    {
        return $this->tracking_details;
    }

    public function setTrackingDetails(?string $tracking_details): static
    {
        $this->tracking_details = $tracking_details;

        return $this;
    }
}
