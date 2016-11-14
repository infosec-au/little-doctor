####################################
#
#  Dockerfile for Pillage.js
#  v0.1
#
FROM python:2.7.11
MAINTAINER moloch


#
# > Fix Apt's broke ass
# https://github.com/docker-library/buildpack-deps/issues/40
#
RUN echo \
   'deb ftp://ftp.us.debian.org/debian/ jessie main\n \
    deb ftp://ftp.us.debian.org/debian/ jessie-updates main\n \
    deb http://security.debian.org jessie/updates main\n' \
    > /etc/apt/sources.list
RUN apt-get clean \
	&& apt-get update --fix-missing \
    && apt-get upgrade -y

#
# Install Node / Update NPM and pip
#
RUN wget https://deb.nodesource.com/setup_4.x
RUN chmod +x ./setup_4.x \
	&& ./setup_4.x \
	&& rm -f ./setup_4.x
RUN apt-get install -y nodejs && \
    npm install -g npm@latest

RUN npm install -g grunt-cli \
    && npm install \
    && pip install --upgrade pip 

#
# Add Source Code
#
RUN mkdir /opt/little-doctor/
ADD . /opt/little-doctor/


#
# Python Dependancies
#
WORKDIR /opt/little-doctor/
RUN pip install -r requirements.txt


#
# Build JS Client
#
WORKDIR /opt/little-doctor/js/
RUN grunt


#
# Define Entrypoint/etc.
#
VOLUME ["/opt/little-doctor/files"]
EXPOSE 8888
ENTRYPOINT ["/opt/little-doctor/main.py"]
