FROM keycloak/keycloak:22.0.1-2

ADD --chown=keycloak export /config/
RUN /opt/keycloak/bin/kc.sh import --dir /config/

ENTRYPOINT ["/opt/keycloak/bin/kc.sh", "--verbose", "start-dev"]
