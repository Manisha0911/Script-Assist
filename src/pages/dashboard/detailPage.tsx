import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Image,
  Text,
  Badge,
  Group,
  Button,
  Loader,
  Center,
  Grid,
  Anchor,
  Container,
  SimpleGrid,
  Drawer,
} from '@mantine/core';
import { useEffect, useState } from 'react';

type Mission = {
  name: string;
  flight: number;
};

type Position = {
  latitude: number;
  longitude: number;
};

type Ship = {
  ship_id: string;
  ship_name: string;
  ship_model: string | null;
  ship_type: string;
  roles: string[];
  active: boolean;
  imo: number;
  mmsi: number;
  abs: number | null;
  class: string | null;
  weight_lbs: number;
  weight_kg: number;
  year_built: number;
  home_port: string;
  status: string;
  speed_kn: number;
  course_deg: number;
  position: Position;
  successful_landings: number | null;
  attempted_landings: number | null;
  missions: Mission[];
  url: string;
  image: string | null;
};

export default function ShipDetails() {
  const { shipId } = useParams();
  const navigate = useNavigate();
  const [ship, setShip] = useState<Ship | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShip = async () => {
      try {
        const res = await fetch(`https://api.spacexdata.com/v3/ships/${shipId}`);
        const data = await res.json();
        setShip(data);
      } catch (error) {
        console.error('Error fetching ship:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchShip();
  }, [shipId]);

  const renderRow = (label: string, value: React.ReactNode) => (
    <Group spacing="xs">
      <Text size="sm" fw={500} c="gray.7">
        {label}:
      </Text>
      <Text size="sm" c="gray.6">
        {value}
      </Text>
    </Group>
  );

  if (loading) {
    return (
      <Center mt="xl">
        <Loader />
      </Center>
    );
  }

  if (!ship) {
    return (
      <Center mt="xl">
        <Text color="red">Ship not found</Text>
      </Center>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      <Group position="apart" w="100%" mb="md">
        <Text fw={700} size="xl" c="indigo.7">
          {ship.ship_name}
        </Text>
        <Button variant="light" color="gray" size="xs" onClick={() => navigate(-1)}>
          Back
        </Button>
      </Group>

      {ship.image && (
        <Image
          src={ship.image}
          alt={ship.ship_name}
          height={200}
          radius="md"
          mb="md"
          fit="cover"
          withPlaceholder
        />
      )}

      <SimpleGrid cols={2} spacing="md" verticalSpacing="xs" breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
        {renderRow('ID', ship.ship_id)}
        {renderRow('Model', ship.ship_model || 'N/A')}
        {renderRow('Type', ship.ship_type)}
        {renderRow(
          'Status',
          <Badge color={ship.active ? 'green' : 'gray'} variant="light" radius="sm">
            {ship.active ? 'Active' : 'Inactive'}
          </Badge>
        )}
        {renderRow('Home Port', ship.home_port)}
        {renderRow('Year Built', ship.year_built)}
        {renderRow('Weight', `${ship.weight_kg} kg / ${ship.weight_lbs} lbs`)}
        {renderRow('Speed', `${ship.speed_kn ?? 'N/A'} kn`)}
        {renderRow('Course', `${ship.course_deg ?? 'N/A'}°`)}
        {renderRow('Status Description', ship.status)}
        {renderRow('IMO', ship.imo)}
        {renderRow('MMSI', ship.mmsi)}
        {renderRow('ABS', ship.abs ?? 'N/A')}
        {renderRow('Class', ship.class ?? 'N/A')}
        {renderRow('Successful Landings', ship.successful_landings ?? 'N/A')}
        {renderRow('Attempted Landings', ship.attempted_landings ?? 'N/A')}
        {renderRow('Latitude', ship.position?.latitude ?? 'N/A')}
        {renderRow('Longitude', ship.position?.longitude ?? 'N/A')}
      </SimpleGrid>

      <Text mt="lg" size="sm" fw={500} c="gray.7">
        Roles:
      </Text>
      <Group mt="xs" spacing="xs">
        {ship.roles.map((role) => (
          <Badge key={role} color="blue" radius="sm" variant="light">
            {role}
          </Badge>
        ))}
      </Group>

      <Text mt="lg" size="sm" fw={500} c="gray.7">
        Missions:
      </Text>
      <ul style={{ marginLeft: 20 }}>
        {ship.missions.map((m) => (
          <li key={m.flight}>
            <Text size="sm" c="gray.6">
              {m.name} (Flight #{m.flight})
            </Text>
          </li>
        ))}
      </ul>

      <Text mt="lg" size="sm" fw={500} c="gray.7">
        More Info:
      </Text>
      <Anchor
        href={ship.url}
        target="_blank"
        rel="noopener noreferrer"
        color="blue.6"
        size="sm"
        fw={400}
      >
        MarineTraffic
      </Anchor>
    </div>
  );
};