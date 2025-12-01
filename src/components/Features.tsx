import React from 'react';
import { motion } from 'framer-motion';
import { Card, Grid, Text } from '@geist-ui/core';
import {
  Link,
  Wallet,
  DollarSign,
  Globe,
  Shield,
  Sparkles,
} from 'lucide-react';

const Features: React.FC = () => {
  const features = [
    {
      icon: Link,
      title: 'Wallet Connection',
      description: 'Connect via WalletConnect with QR and deep links.',
    },
    {
      icon: Wallet,
      title: 'Address Display',
      description: 'View your wallet identity with clean formatting.',
    },
    {
      icon: DollarSign,
      title: 'Balance Display',
      description: 'Track ETH balances on Base in real-time.',
    },
    {
      icon: Globe,
      title: 'Network Info',
      description: 'See network context and switch safely.',
    },
    {
      icon: Shield,
      title: 'Secure Disconnect',
      description: 'One click to end any session securely.',
    },
    {
      icon: Sparkles,
      title: 'Smooth Animations',
      description: 'Framer Motion + GSAP elevate micro-interactions.',
    },
  ];

  return (
    <motion.div
      className="py-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.6 }}
    >
      <div className="text-center mb-12">
        <Text h2 className="mb-2">
          Why Choose BaseConnect?
        </Text>
        <Text span type="secondary">
          A modern, lightweight dApp that makes Base interaction simple and secure.
        </Text>
      </div>

      <Grid.Container gap={2.5}>
        {features.map((feature, index) => (
          <Grid xs={24} sm={12} md={8} key={feature.title}>
            <motion.div
              className="w-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
              whileHover={{ y: -6, scale: 1.01 }}
            >
              <Card shadow>
                <Card.Content>
                  <div className="mb-4">
                    <feature.icon className="w-12 h-12 text-base-blue" />
                  </div>
                  <Text h4 className="mb-1">
                    {feature.title}
                  </Text>
                  <Text small type="secondary">
                    {feature.description}
                  </Text>
                </Card.Content>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid.Container>
    </motion.div>
  );
};

export default Features;
