import { IconBrandGithub, IconExternalLink } from '@tabler/icons-react';
import { ActionIcon, Container, Group, Text } from '@mantine/core';
import classes from './FooterSocial.module.css';

export function FooterSocial() {
  return (
    <div className={classes.footer}>
      <Container className={classes.inner}>
        <Text size="lg" fw={700} c="blue">RailMemo</Text>
        <Group gap={0} className={classes.links} justify="flex-end" wrap="nowrap">
          <ActionIcon 
            size="lg" 
            color="gray" 
            variant="subtle"
            component="a"
            href="https://github.com/damesck233/RailMemo"
            target="_blank"
            rel="noopener noreferrer"
          >
            <IconBrandGithub size={18} stroke={1.5} />
          </ActionIcon>
          <ActionIcon 
            size="lg" 
            color="gray" 
            variant="subtle"
            component="a"
            href="https://damesck.net/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <IconExternalLink size={18} stroke={1.5} />
          </ActionIcon>
        </Group>
      </Container>
    </div>
  );
}