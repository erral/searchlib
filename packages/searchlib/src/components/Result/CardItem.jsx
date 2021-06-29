import React from 'react';
import { Divider, Button, Grid, Card, Image, Label } from 'semantic-ui-react';
import { DateTime, StringList } from '@eeacms/search';
import { useAppConfig } from '@eeacms/search/lib/hocs';
import cx from 'classnames';

const ExternalLink = (props) => {
  return (
    <a
      className={props.className}
      href={props.href}
      target="_blank"
      rel="noreferrer"
      style={props.style}
    >
      {props.children}
    </a>
  );
};

const CardItemComponent = (props) => {
  const { result } = props;
  const { appConfig, registry } = useAppConfig();
  const days =
    (Date.now() - Date.parse(result['issued']?.raw)) / 1000 / 60 / 60 / 24;
  // console.log('card props', props, appConfig);

  const thumbFactoryName = appConfig.cardViewParams.getThumbnailUrl;

  const getThumb =
    registry.resolve[thumbFactoryName] ||
    ((result, config, fallback) => fallback);

  const thumbUrl = getThumb(
    result,
    appConfig,
    // TODO: use a configured default
    'https://react.semantic-ui.com/images/wireframe/white-image.png',
  );

  const url = result.id?.raw;

  const [hovered, setHovered] = React.useState(false);

  return (
    <Card
      className={cx('card-item', { hovered })}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Label className="meta-type">
        <StringList value={result[props.metatypeField]?.raw} />
      </Label>

      <Image
        src={thumbUrl}
        wrapped
        ui={false}
        fluid
        centered
        style={{ backgroundImage: `url('${thumbUrl}')` }}
        as={ExternalLink}
        href={url}
        target="_blank"
        rel="noreferrer"
        label={
          days < 30 && (
            <Label color="yellow" ribbon="right">
              New
            </Label>
          )
        }
      />

      <Card.Content>
        <Card.Meta>{url}</Card.Meta>
        <Card.Header>
          <ExternalLink href={url}>
            {result[props.titleField]?.raw}
          </ExternalLink>
        </Card.Header>
        <Card.Description>
          {result[props.descriptionField]?.raw}
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Card.Meta>
          <StringList value={result[props.tagsField]?.raw} />
        </Card.Meta>
      </Card.Content>
      <Card.Content extra>
        <Card.Meta>
          <DateTime format="DATE_MED" value={result[props.issuedField]?.raw} />
        </Card.Meta>
      </Card.Content>
      <Card.Content extra className="controls">
        <Card.Meta>
          <Button compact floated="left" color="green" size="mini">
            more like this
          </Button>
          {/* <Button compact size="mini" icon="globe"></Button> */}
          <Button compact floated="right" color="red" size="mini">
            less like this
          </Button>
        </Card.Meta>
      </Card.Content>
    </Card>
  );
};

const CardItem = (props) => <CardItemComponent {...props} />;

export default CardItem;
